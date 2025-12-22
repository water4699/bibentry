import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { AthleteRegistration } from "../typechain-types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("AthleteRegistrationSepolia", function () {
  let signers: Signers;
  let athleteRegistrationContract: AthleteRegistration;
  let athleteRegistrationContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const AthleteRegistrationDeployment = await deployments.get("AthleteRegistration");
      athleteRegistrationContractAddress = AthleteRegistrationDeployment.address;
      athleteRegistrationContract = await ethers.getContractAt("AthleteRegistration", AthleteRegistrationDeployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("register and decrypt athlete data on Sepolia", async function () {
    steps = 12;

    this.timeout(4 * 60000); // 4 minutes timeout for Sepolia

    // Check if already registered
    progress("Checking registration status...");
    const isRegistered = await athleteRegistrationContract.isAthleteRegistered();
    progress(`Registration status: ${isRegistered}`);

    if (!isRegistered) {
      progress("Not registered yet. Preparing to register athlete...");

      // Test data
      const testName = "John Doe";
      const testAge = 28;
      const testContact = "john.doe@example.com";
      const testSportCategory = 3; // Endurance Sports

      // Create hash functions for strings (simplified for testing)
      const hashString = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 4294967295;
      };

      // Hash the data
      const nameHash = hashString(testName);
      const contactHash = hashString(testContact);

      progress(`Encrypting athlete data...`);
      const encryptedNameHash = await fhevm
        .createEncryptedInput(athleteRegistrationContractAddress, signers.alice.address)
        .add32(nameHash)
        .encrypt();

      const encryptedAge = await fhevm
        .createEncryptedInput(athleteRegistrationContractAddress, signers.alice.address)
        .add32(testAge)
        .encrypt();

      const encryptedContactHash = await fhevm
        .createEncryptedInput(athleteRegistrationContractAddress, signers.alice.address)
        .add32(contactHash)
        .encrypt();

      const encryptedSportCategory = await fhevm
        .createEncryptedInput(athleteRegistrationContractAddress, signers.alice.address)
        .add32(testSportCategory)
      .encrypt();

      progress(`Submitting athlete registration transaction...`);
      const tx = await athleteRegistrationContract
        .connect(signers.alice)
        .registerAthlete(
          encryptedNameHash.handles[0],
          encryptedNameHash.inputProof,
          encryptedAge.handles[0],
          encryptedAge.inputProof,
          encryptedContactHash.handles[0],
          encryptedContactHash.inputProof,
          encryptedSportCategory.handles[0],
          encryptedSportCategory.inputProof
        );
      await tx.wait();
      progress(`Registration transaction confirmed: ${tx.hash}`);
    }

    // Verify registration
    progress(`Verifying registration...`);
    const registeredAfter = await athleteRegistrationContract.isAthleteRegistered();
    expect(registeredAfter).to.be.true;
    progress(`Registration confirmed: ${registeredAfter}`);

    // Get encrypted data
    progress(`Retrieving encrypted athlete data...`);
    const encryptedNameHashRetrieved = await athleteRegistrationContract.getNameHash();
    const encryptedAgeRetrieved = await athleteRegistrationContract.getAge();
    const encryptedContactHashRetrieved = await athleteRegistrationContract.getContactHash();
    const encryptedSportCategoryRetrieved = await athleteRegistrationContract.getSportCategory();
    const registrationTimestamp = await athleteRegistrationContract.getRegistrationTimestamp();

    expect(encryptedNameHashRetrieved).to.not.eq(ethers.ZeroHash);
    expect(encryptedAgeRetrieved).to.not.eq(ethers.ZeroHash);
    expect(encryptedContactHashRetrieved).to.not.eq(ethers.ZeroHash);
    expect(encryptedSportCategoryRetrieved).to.not.eq(ethers.ZeroHash);
    expect(registrationTimestamp).to.be.gt(0);

    progress(`Encrypted data retrieved successfully`);

    // Decrypt data
    progress(`Decrypting name hash...`);
    const decryptedNameHash = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedNameHashRetrieved,
      athleteRegistrationContractAddress,
      signers.alice,
    );
    progress(`Name hash decrypted: ${decryptedNameHash}`);

    progress(`Decrypting age...`);
    const decryptedAge = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedAgeRetrieved,
      athleteRegistrationContractAddress,
      signers.alice,
    );
    progress(`Age decrypted: ${decryptedAge}`);

    progress(`Decrypting contact hash...`);
    const decryptedContactHash = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedContactHashRetrieved,
      athleteRegistrationContractAddress,
      signers.alice,
    );
    progress(`Contact hash decrypted: ${decryptedContactHash}`);

    progress(`Decrypting sport category...`);
    const decryptedSportCategory = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedSportCategoryRetrieved,
      athleteRegistrationContractAddress,
      signers.alice,
    );
    progress(`Sport category decrypted: ${decryptedSportCategory}`);

    // Verify decrypted values are reasonable
    expect(decryptedNameHash).to.be.gt(0);
    expect(decryptedAge).to.be.within(10, 100); // reasonable age range
    expect(decryptedContactHash).to.be.gt(0);
    expect(decryptedSportCategory).to.be.within(1, 5); // valid sport categories

    progress(`All data decrypted and verified successfully!`);

    // Get total athletes count
    const totalAthletes = await athleteRegistrationContract.getTotalAthletes();
    progress(`Total registered athletes: ${totalAthletes}`);
    expect(totalAthletes).to.be.gte(1);
  });
});
