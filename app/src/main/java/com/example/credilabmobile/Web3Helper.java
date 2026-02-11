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
        Function function = new Function(
                "balanceOf",
                Collections.singletonList(new Address(walletAddress)),
                Collections.singletonList(new TypeReference<Uint256>() {
                }));

        String encodedFunction = FunctionEncoder.encode(function);

        EthCall response = web3j.ethCall(
                Transaction.createEthCallTransaction(
                        walletAddress,
                        Constants.CLB_CONTRACT_ADDRESS,
                        encodedFunction),
                DefaultBlockParameterName.LATEST).send();

        List<org.web3j.abi.datatypes.Type> results = FunctionReturnDecoder.decode(
                response.getValue(), function.getOutputParameters());

        if (results.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigInteger rawBalance = (BigInteger) results.get(0).getValue();
        return new BigDecimal(rawBalance)
                .divide(BigDecimal.TEN.pow(Constants.TOKEN_DECIMALS), 4, RoundingMode.DOWN);
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
