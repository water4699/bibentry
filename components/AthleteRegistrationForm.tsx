"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { UseAthleteRegistrationReturnType, SportCategory } from "@/hooks/useAthleteRegistration";

interface AthleteRegistrationFormProps {
  athleteRegistration: UseAthleteRegistrationReturnType;
}

export const AthleteRegistrationForm = ({ athleteRegistration }: AthleteRegistrationFormProps) => {
  const { address, isConnected, chainId } = useAccount();

  // For local development (chainId 31337), allow registration without wallet connection
  const isLocalDevelopment = chainId === 31337;
  const effectiveIsConnected = isConnected || isLocalDevelopment;
  const [hasMounted, setHasMounted] = useState(false);

  // Use the passed athlete registration hook instance
  const {
    isRegistering,
    isRegistered,
    canRegister,
    message,
    error,
  } = athleteRegistration;

  console.log("🎯 AthleteRegistrationForm: Using shared athleteRegistration hook instance");

  // Debug canRegister status
  useEffect(() => {
    console.log("🔍 Registration Status Debug:");
    console.log("- canRegister:", canRegister);
    console.log("- isRegistering:", isRegistering);
    console.log("- isRegistered:", isRegistered);
    console.log("- chainId:", chainId);
    console.log("- address:", address);
    console.log("- isConnected:", isConnected);
    console.log("- effectiveIsConnected:", effectiveIsConnected);
    console.log("- isLocalDevelopment:", isLocalDevelopment);
  }, [canRegister, isRegistering, isRegistered, chainId, address, isConnected, effectiveIsConnected, isLocalDevelopment]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    age: 18,
    contact: "",
    sportCategory: SportCategory.Individual,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canRegister) {
      alert("Cannot register athlete at this time");
      return;
    }

    try {
      // Convert contact to number and validate uint32 range (0 to 4294967295)
      const cleanedContact = formData.contact.replace(/\D/g, '');
      const contactNumber = parseInt(cleanedContact) || 0;
      
      // uint32 max value: 2^32 - 1 = 4294967295
      const UINT32_MAX = 4294967295;
      
      if (contactNumber > UINT32_MAX) {
        alert(`❌ Contact number is too large!\n\nMaximum allowed value: ${UINT32_MAX.toLocaleString()}\nYour value: ${contactNumber.toLocaleString()}\n\nPlease enter a contact number within the valid range.`);
        return;
      }
      
      if (contactNumber < 0) {
        alert('❌ Contact number cannot be negative!');
        return;
      }

      await athleteRegistration.registerAthlete(
        formData.name,
        formData.age,
        contactNumber,
        formData.sportCategory,
        athleteRegistration.fhevmInstance
      );

      // Reset form on success
      setFormData({
        name: "",
        age: 18,
        contact: "",
        sportCategory: SportCategory.Individual,
      });

      alert("Athlete registered successfully!");
    } catch (err) {
      console.error("Registration failed:", err);
      alert(`Registration failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };


  if (!hasMounted) {
    return (
      <div className="diary-form">
        <h2 className="diary-form-title">Loading...</h2>
        <p className="text-secondary mb-6 text-center">Initializing form</p>
      </div>
    );
  }

  return (
    <div className="diary-form">
      <h2 className="diary-form-title">📝 Athlete Registration Form</h2>
      <p className="text-secondary mb-6 text-center">
        🔐 Your personal information will be encrypted using Fully Homomorphic Encryption (FHE) and stored securely on the blockchain. <br />
        🗝️ Only you can decrypt and view your data using your private key. <br />
        🛡️ Privacy-first sports registration!
      </p>

      <form onSubmit={handleSubmit} className="diary-form-form">
        <div className="diary-form-group">
          <label className="diary-form-label">👤 Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="Enter athlete's full name"
            required
            disabled={isRegistering}
          />
        </div>

        <div className="diary-form-group">
          <label className="diary-form-label">🎂 Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
            className="input-field"
            min="10"
            max="100"
            required
            disabled={isRegistering}
          />
        </div>

        <div className="diary-form-group">
          <label className="diary-form-label">
            📞 Contact Information
            <span className="text-muted" style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              (max: 4,294,967,295)
            </span>
          </label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => {
              // Only allow numbers
              const numbersOnly = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, contact: numbersOnly });
            }}
            className="input-field"
            placeholder="Enter contact number (numbers only, max: 4294967295)"
            required
            disabled={isRegistering}
            maxLength={10}
            pattern="[0-9]*"
            inputMode="numeric"
          />
          {formData.contact && (() => {
            const contactNum = parseInt(formData.contact.replace(/\D/g, '')) || 0;
            const UINT32_MAX = 4294967295;
            if (contactNum > UINT32_MAX) {
              return (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444', fontWeight: 500 }}>
                  ⚠️ Contact number exceeds maximum value (4,294,967,295). Please enter a smaller number.
                </p>
              );
            }
            if (contactNum > 0 && contactNum <= UINT32_MAX) {
              return (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#10b981', fontWeight: 500 }}>
                  ✅ Valid contact number
                </p>
              );
            }
            return null;
          })()}
        </div>

        <div className="diary-form-group">
          <label className="diary-form-label">🏅 Sport Category</label>
          <select
            value={formData.sportCategory}
            onChange={(e) => setFormData({ ...formData, sportCategory: parseInt(e.target.value) as SportCategory })}
            className="input-field"
            required
            disabled={isRegistering}
          >
            {Object.values(SportCategory).filter(value => typeof value === 'number').map((categoryValue) => {
              const categoryNames = ['🏃‍♂️ Individual', '⚽ Team', '🏊‍♂️ Endurance', '🥊 Combat', '🏋️‍♂️ Other'];
              return (
                <option key={categoryValue as number} value={categoryValue as number}>
                  {categoryNames[categoryValue as number]}
              </option>
              );
            })}
          </select>
        </div>

        {/* Status messages */}
        {message && (
          <div className={`message ${error ? 'message-error' : 'message-success'}`}>
            {error ? '❌' : '✅'} {message}
          </div>
        )}

        <div className="diary-form-submit">
          <button
            type="submit"
            className="btn-primary"
            disabled={!canRegister || isRegistering}
          >
            {isRegistering ? "⏳ Registering..." : "🚀 Register Athlete"}
          </button>
        </div>
      </form>
    </div>
  );
};
