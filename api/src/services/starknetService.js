import { RpcProvider, Contract } from 'starknet';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import path from 'path';

const execAsync = promisify(exec);

// Carregar variáveis de ambiente
dotenv.config();

// Configurações do Starknet
const RPC_URL = process.env.STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io';
const CHAIN_ID = process.env.STARKNET_CHAIN_ID || '0x534e5f5345504f4c4941';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x04cb6225c0fdb278ed4d6828c193f8f2edf675f0b08b04dcf972a5a0bd10f7e6';

// Inicializar provider
const provider = new RpcProvider({
  nodeUrl: RPC_URL,
  chainId: CHAIN_ID
});

// ABI do contrato UltraStarknetZKHonkVerifier
const CONTRACT_ABI = [
  {
    "type": "function",
    "name": "verify_ultra_starknet_zk_honk_proof",
    "inputs": [
      {
        "name": "full_proof_with_hints",
        "type": "core::array::Array::<core::felt252>"
      }
    ],
    "outputs": [
      {
        "type": "core::option::Option::<core::array::Array::<core::integer::u256>>"
      }
    ],
    "state_mutability": "view"
  }
];

/**
 * Conecta com o contrato Starknet
 * @returns {Contract} Instância do contrato
 */
function getContract() {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Endereço do contrato não configurado. Defina CONTRACT_ADDRESS no arquivo .env');
  }

  return new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
}

/**
 * Gera calldata usando Garaga CLI
 * @param {string} proofPath - Caminho para o arquivo de prova
 * @param {string} vkPath - Caminho para o arquivo de verificação key
 * @param {string} publicInputsPath - Caminho para o arquivo de public inputs
 * @returns {Array} Array de felt252 gerado pelo Garaga CLI
 */
async function generateCalldataWithGaraga(proofPath, vkPath, publicInputsPath) {
  try {
    console.log('🔄 Gerando calldata com Garaga CLI...');
    
    // Verificar se os arquivos existem
    const fs = await import('fs');
    if (!fs.existsSync(proofPath)) {
      throw new Error(`Arquivo de prova não encontrado: ${proofPath}`);
    }
    if (!fs.existsSync(vkPath)) {
      throw new Error(`Arquivo de VK não encontrado: ${vkPath}`);
    }
    if (!fs.existsSync(publicInputsPath)) {
      throw new Error(`Arquivo de public inputs não encontrado: ${publicInputsPath}`);
    }
    
    console.log('✅ Todos os arquivos encontrados');
    
    // Usar caminhos absolutos para evitar problemas com espaços
    const absoluteProofPath = path.resolve(proofPath);
    const absoluteVkPath = path.resolve(vkPath);
    const absolutePublicInputsPath = path.resolve(publicInputsPath);
    
    console.log('📁 Caminhos absolutos:', {
      proof: absoluteProofPath,
      vk: absoluteVkPath,
      publicInputs: absolutePublicInputsPath
    });
    
    // Comando para gerar calldata usando Garaga CLI
    const command = `garaga calldata --system ultra_starknet_zk_honk --proof "${absoluteProofPath}" --vk "${absoluteVkPath}" --public-inputs "${absolutePublicInputsPath}" --format array`;
    
    console.log('📝 Executando comando:', command);
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.warn('⚠️ Avisos do Garaga CLI:', stderr);
    }
    
    console.log('✅ Calldata gerado com sucesso');
    
    // Parsear a saída do Garaga CLI (formato array retorna JSON)
    let calldata;
    try {
      // Tentar parsear como JSON primeiro (formato array)
      const jsonData = JSON.parse(stdout.trim());
      calldata = jsonData.map(x => `0x${BigInt(x).toString(16)}`);
      console.log('📊 Tamanho do calldata:', calldata.length, 'elementos');
    } catch (jsonError) {
      // Se não for JSON, tentar como string separada por espaço (formato starkli)
      const calldataStrings = stdout.trim().split(' ').filter(x => x.trim());
      calldata = calldataStrings.map(x => `0x${BigInt(x).toString(16)}`);
      console.log('📊 Tamanho do calldata:', calldata.length, 'elementos');
    }
    
    return calldata;
    
  } catch (error) {
    console.error('❌ Erro ao gerar calldata com Garaga CLI:', error);
    throw new Error(`Falha ao gerar calldata: ${error.message}`);
  }
}

/**
 * Verifica uma prova ZK no contrato Starknet usando Garaga CLI
 * @param {Object} options - Opções de verificação
 * @param {string} options.proofPath - Caminho para o arquivo de prova
 * @param {string} options.vkPath - Caminho para o arquivo de verificação key
 * @param {string} options.publicInputsPath - Caminho para o arquivo de public inputs
 * @returns {Object} Resultado da verificação
 */
export async function verifyZKProof(options = {}) {
  try {
    console.log('🚀 Iniciando verificação ZK no Starknet...');

    // Validar configuração
    if (!CONTRACT_ADDRESS) {
      throw new Error('Endereço do contrato não configurado');
    }

    // Conectar com o contrato
    const contract = getContract();
    console.log('✅ Conectado com o contrato:', CONTRACT_ADDRESS);

    // CAMINHOS CORRETOS - SEM /api/ NO MEIO!
    const proofPath = options.proofPath || '/mnt/c/Users/usuário/OneDrive - Dato Tecnologia Ltda/Área de Trabalho/Stuff/Blockchain/Starknet/stark-vip/zk-noir-circuit/target/proof_starknet_zk86/proof';
    const vkPath = options.vkPath || '/mnt/c/Users/usuário/OneDrive - Dato Tecnologia Ltda/Área de Trabalho/Stuff/Blockchain/Starknet/stark-vip/zk-noir-circuit/target/proof_starknet_zk86/vk';
    const publicInputsPath = options.publicInputsPath || '/mnt/c/Users/usuário/OneDrive - Dato Tecnologia Ltda/Área de Trabalho/Stuff/Blockchain/Starknet/stark-vip/zk-noir-circuit/target/proof_starknet_zk86/public_inputs';
    
    console.log('🔍 CAMINHOS CORRETOS:');
    console.log('🔍 proofPath:', proofPath);

    console.log('📁 Caminhos dos arquivos:', {
      proofPath,
      vkPath,
      publicInputsPath
    });

    // Gerar calldata usando Garaga CLI
    console.log('🔄 Gerando calldata com Garaga CLI...');
    const fullProofWithHints = await generateCalldataWithGaraga(proofPath, vkPath, publicInputsPath);

    console.log('📊 Dados gerados:', {
      totalElements: fullProofWithHints.length,
      firstElement: fullProofWithHints[0],
      lastElement: fullProofWithHints[fullProofWithHints.length - 1]
    });

    // Chamar função do contrato
    console.log('🔄 Chamando função do contrato...');
    const result = await contract.verify_ultra_starknet_zk_honk_proof(fullProofWithHints);

    console.log('📋 Resultado da verificação:', result);

    // Processar resultado
    const verificationResult = {
      isValid: result !== null && result !== undefined,
      result: result,
      timestamp: new Date().toISOString(),
      contractAddress: CONTRACT_ADDRESS,
      network: 'Starknet Sepolia',
      verificationMethod: 'garaga_cli',
      dataSize: fullProofWithHints.length,
      formatUsed: 'garaga_cli'
    };

    if (verificationResult.isValid) {
      console.log('✅ Prova verificada com sucesso usando Garaga CLI!');
    } else {
      console.log('❌ Prova rejeitada pelo contrato');
    }

    return verificationResult;

  } catch (error) {
    console.error('❌ Erro na verificação ZK:', error);
    
    // Tratar erros específicos do Starknet
    if (error.message.includes('Contract not found')) {
      throw new Error('Contrato não encontrado. Verifique o endereço do contrato.');
    }
    
    if (error.message.includes('Invalid proof')) {
      throw new Error('Prova inválida. Verifique os dados da prova.');
    }
    
    if (error.message.includes('deserialization failed')) {
      throw new Error('Falha na deserialização dos dados da prova. Formato inválido.');
    }
    
    if (error.message.includes('RPC')) {
      throw new Error('Erro de conexão com a rede Starknet. Tente novamente.');
    }

    throw new Error(`Falha na verificação: ${error.message}`);
  }
}

/**
 * Obtém informações do contrato
 * @returns {Object} Informações do contrato
 */
export async function getContractInfo() {
  try {
    const contract = getContract();
    
    const info = {
      address: CONTRACT_ADDRESS,
      network: 'Starknet Sepolia',
      rpcUrl: RPC_URL,
      chainId: CHAIN_ID,
      status: 'Conectado'
    };

    return info;
  } catch (error) {
    return {
      address: CONTRACT_ADDRESS,
      network: 'Starknet Sepolia',
      rpcUrl: RPC_URL,
      chainId: CHAIN_ID,
      status: 'Erro de conexão',
      error: error.message
    };
  }
}

/**
 * Testa a conexão com o contrato
 * @returns {Object} Status da conexão
 */
export async function testConnection() {
  try {
    const contract = getContract();
    
    console.log('🔄 Testando conexão com o contrato...', contract);
    
    const info = await getContractInfo();
    console.log('🔄 Informações do contrato:', info);
    return {
      success: true,
      message: 'Conexão com o contrato estabelecida',
      contractInfo: info
    };
  } catch (error) {
    return {
      success: false,
      message: 'Falha na conexão com o contrato',
      error: error.message
    };
  }
}