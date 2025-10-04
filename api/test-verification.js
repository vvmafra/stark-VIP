#!/usr/bin/env node

/**
 * Script de teste para verificação ZK simplificada
 * 
 * Uso:
 * node test-verification.js
 * 
 * Este script testa a verificação ZK usando apenas o Garaga CLI
 * com os arquivos padrão do projeto.
 */

import { verifyZKProof, testConnection } from './src/services/starknetService.js';
import path from 'path';

async function testVerification() {
  try {
    console.log('🚀 Iniciando teste de verificação ZK...\n');

    // Testar conexão primeiro
    console.log('1️⃣ Testando conexão com o contrato...');
    const connectionTest = await testConnection();
    
    if (!connectionTest.success) {
      console.error('❌ Falha na conexão:', connectionTest.message);
      return;
    }
    
    console.log('✅ Conexão estabelecida:', connectionTest.message);
    console.log('📋 Informações do contrato:', connectionTest.contractInfo);
    console.log('');

    // Caminhos dos arquivos padrão do projeto
    const proofPath = path.resolve('zk-noir-circuit/target/proof_starknet_zk86/proof');
    const vkPath = path.resolve('zk-noir-circuit/target/proof_starknet_zk86/vk');
    const publicInputsPath = path.resolve('zk-noir-circuit/target/proof_starknet_zk86/public_inputs');

    console.log('2️⃣ Verificando arquivos necessários...');
    console.log('📁 Caminhos dos arquivos:');
    console.log(`   - Proof: ${proofPath}`);
    console.log(`   - VK: ${vkPath}`);
    console.log(`   - Public Inputs: ${publicInputsPath}`);
    console.log('');

    // Executar verificação
    console.log('3️⃣ Executando verificação ZK...');
    const result = await verifyZKProof({
      proofPath,
      vkPath,
      publicInputsPath
    });

    console.log('');
    console.log('📊 Resultado da verificação:');
    console.log(`   - Válida: ${result.isValid ? '✅ Sim' : '❌ Não'}`);
    console.log(`   - Método: ${result.verificationMethod}`);
    console.log(`   - Formato: ${result.formatUsed}`);
    console.log(`   - Tamanho dos dados: ${result.dataSize} elementos`);
    console.log(`   - Timestamp: ${result.timestamp}`);
    console.log(`   - Contrato: ${result.contractAddress}`);
    console.log(`   - Rede: ${result.network}`);

    if (result.isValid) {
      console.log('');
      console.log('🎉 SUCESSO! A prova foi verificada com sucesso no contrato Starknet!');
    } else {
      console.log('');
      console.log('⚠️ A prova foi rejeitada pelo contrato.');
    }

  } catch (error) {
    console.error('');
    console.error('❌ Erro durante o teste:', error.message);
    
    if (error.message.includes('garaga')) {
      console.error('');
      console.error('💡 Dica: Certifique-se de que o Garaga CLI está instalado e disponível no PATH.');
      console.error('   Instale com: cargo install garaga');
    }
    
    if (error.message.includes('ENOENT')) {
      console.error('');
      console.error('💡 Dica: Certifique-se de que os arquivos de prova existem no diretório correto.');
      console.error('   Execute primeiro: cd zk-noir-circuit && nargo prove');
    }
    
    process.exit(1);
  }
}

// Executar teste se este arquivo for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testVerification();
}

export { testVerification };
