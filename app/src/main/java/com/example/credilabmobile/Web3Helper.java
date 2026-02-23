package com.example.credilabmobile;

import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.http.HttpService;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Web3Helper {
        private final Web3j web3j;

        public Web3Helper() {
                web3j = Web3j.build(new HttpService(Constants.SEPOLIA_RPC_URL));
        }

        public BigDecimal getCLBBalance(String walletAddress) throws Exception {
                android.util.Log.d("Web3Helper", "getCLBBalance called with raw address: [" + walletAddress + "]");

                if (walletAddress == null || walletAddress.isEmpty()) {
                        android.util.Log.w("Web3Helper", "EXIT: address is null or empty");
                        return BigDecimal.ZERO;
                }

                // Strip CAIP-10 prefix if present (e.g. "eip155:11155111:0xABC..." ->
                // "0xABC...")
                String cleanAddress = walletAddress;
                if (walletAddress.contains(":")) {
                        String[] parts = walletAddress.split(":");
                        cleanAddress = parts[parts.length - 1]; // take the last part (the actual address)
                        android.util.Log.d("Web3Helper", "Stripped CAIP-10 prefix, clean address: " + cleanAddress);
                }

                android.util.Log.d("Web3Helper", "Querying contract: " + Constants.CLB_CONTRACT_ADDRESS);
                android.util.Log.d("Web3Helper", "Using RPC: " + Constants.SEPOLIA_RPC_URL);

                Function function = new Function(
                                "balanceOf",
                                Collections.singletonList(new Address(cleanAddress)),
                                Collections.singletonList(new TypeReference<Uint256>() {
                                }));

                String encodedFunction = FunctionEncoder.encode(function);
                android.util.Log.d("Web3Helper", "Encoded call data: " + encodedFunction);

                EthCall response = web3j.ethCall(
                                Transaction.createEthCallTransaction(
                                                cleanAddress,
                                                Constants.CLB_CONTRACT_ADDRESS,
                                                encodedFunction),
                                DefaultBlockParameterName.LATEST).send();

                // Check for RPC error or empty response
                if (response.hasError()) {
                        android.util.Log.e("Web3Helper", "EXIT: RPC error: " + response.getError().getMessage()
                                        + " (code: " + response.getError().getCode() + ")");
                        throw new Exception("RPC error: " + response.getError().getMessage());
                }

                String value = response.getValue();
                android.util.Log.d("Web3Helper", "Raw RPC response value: [" + value + "]");

                if (value == null || value.equals("0x") || value.isEmpty()) {
                        android.util.Log.w("Web3Helper", "EXIT: Empty/null response");
                        return BigDecimal.ZERO;
                }

                List<org.web3j.abi.datatypes.Type> results = FunctionReturnDecoder.decode(
                                value, function.getOutputParameters());

                if (results.isEmpty()) {
                        android.util.Log.w("Web3Helper", "EXIT: Decoded results empty");
                        return BigDecimal.ZERO;
                }

                BigInteger rawBalance = (BigInteger) results.get(0).getValue();
                android.util.Log.d("Web3Helper", "Raw balance BigInteger: " + rawBalance.toString());
                BigDecimal humanBalance = new BigDecimal(rawBalance)
                                .divide(BigDecimal.TEN.pow(Constants.TOKEN_DECIMALS), 4, RoundingMode.DOWN);
                android.util.Log.d("Web3Helper", "Final human-readable balance: " + humanBalance.toPlainString());
                return humanBalance;
        }

        public String buildTransferData(String toAddress, BigDecimal amount) {
                BigInteger rawAmount = amount
                                .multiply(BigDecimal.TEN.pow(Constants.TOKEN_DECIMALS))
                                .toBigInteger();

                Function function = new Function(
                                "transfer",
                                Arrays.asList(new Address(toAddress), new Uint256(rawAmount)),
                                Collections.emptyList());

                return FunctionEncoder.encode(function);
        }

        public void shutdown() {
                web3j.shutdown();
        }
}
