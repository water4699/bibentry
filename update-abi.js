const fs = require('fs');
const path = require('path');

const sourceAbiPath = path.join(__dirname, 'deployments', 'localhost', 'AthleteRegistration.json');
const targetAbiPath = path.join(__dirname, 'abi', 'AthleteRegistrationABI.ts');

try {
  const deploymentData = JSON.parse(fs.readFileSync(sourceAbiPath, 'utf8'));
  const abi = deploymentData.abi; // It's already an array

  // Convert simplified ABI to full JSON format
  const fullAbi = abi.map(item => {
    if (item.startsWith('constructor')) {
      return { inputs: [], stateMutability: 'nonpayable', type: 'constructor' };
    } else if (item.startsWith('event ')) {
      const match = item.match(/event (\w+)\((.+)\)/);
      if (match) {
        const eventName = match[1];
        const params = match[2];
        return {
          anonymous: false,
          inputs: params.split(',').map(p => {
            const parts = p.trim().split(' ');
            const indexed = parts.includes('indexed');
            const type = parts[0];
            const name = parts[parts.length - 1];
            return { indexed, internalType: type, name, type };
          }),
          name: eventName,
          type: 'event'
        };
      }
    } else if (item.startsWith('function ')) {
      const match = item.match(/function (\w+)\(([^)]*)\) (.+ )?returns \(([^)]*)\)/);
      if (match) {
        const [, name, inputs, , outputs] = match;
        return {
          inputs: inputs ? inputs.split(',').map(p => {
            const [type, ...rest] = p.trim().split(' ');
            return { internalType: type, name: rest.join(' ') || '', type };
          }) : [],
          name,
          outputs: outputs ? outputs.split(',').map(p => {
            const [type, ...rest] = p.trim().split(' ');
            return { internalType: type, name: rest.join(' ') || '', type };
          }) : [],
          stateMutability: item.includes(' pure ') ? 'pure' : item.includes(' view ') ? 'view' : item.includes(' payable ') ? 'payable' : 'nonpayable',
          type: 'function'
        };
      }
    }
    return null;
  }).filter(Boolean);

  const abiContent = 'export const AthleteRegistrationABI = ' + JSON.stringify({ abi: fullAbi }, null, 2) + ' as const;';
  fs.writeFileSync(targetAbiPath, abiContent);

  console.log('✅ Full ABI format updated successfully');
  console.log(`📍 Source: ${sourceAbiPath}`);
  console.log(`📍 Target: ${targetAbiPath}`);
} catch (error) {
  console.error('❌ Failed to update ABI:', error.message);
}
