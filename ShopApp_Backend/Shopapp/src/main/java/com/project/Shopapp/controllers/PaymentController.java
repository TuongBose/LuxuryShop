package com.project.Shopapp.controllers;

import com.project.Shopapp.components.LocalizationUtils;
import com.project.Shopapp.dtos.*;
import com.project.Shopapp.responses.ResponseObject;
import com.project.Shopapp.services.vnpay.VNPayService;
import com.project.Shopapp.utils.MessageKeys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/payments")
@RequiredArgsConstructor
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    private final VNPayService vnPayService;
    private final LocalizationUtils localizationUtils;

    @PostMapping("/create_payment_url")
    public ResponseEntity<ResponseObject> createPayment(@RequestBody PaymentDTO paymentDTO, HttpServletRequest request) {
        try {
            String paymentUrl = vnPayService.createPaymentUrl(paymentDTO, request);

            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Payment URL generated successfully")
                    .status(HttpStatus.OK)
                    .data(paymentUrl)
                    .build());
        } catch (Exception e) {
            logger.error("Error generating payment URL: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseObject.builder()
                            .message("Error generating payment URL: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .build());
        }
    }

//    @PutMapping("/update-status")
//    public ResponseEntity<ResponseObject> updatePaymentStatus(@RequestBody UpdatePaymentStatusDTO statusDto,
//                                                              BindingResult result) {
//        if (result.hasErrors()) {
//            List<String> errorMessages = result.getFieldErrors()
//                    .stream()
//                    .map(FieldError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.badRequest().body(ResponseObject.builder()
//                    .status(HttpStatus.BAD_REQUEST)
//                    .message(errorMessages.toString())
//                    .build());
//        }
//        try {
//            PaymentResponse paymentResponse = paymentService.updatePaymentStatus(statusDto);
//            return ResponseEntity.ok(ResponseObject.builder()
//                    .status(HttpStatus.OK)
//                    .message(localizationUtils.getLocalizedMessage(
//                            MessageKeys.PAYMENT_UPDATE_SUCCESSFULLY))
//                    .data(paymentResponse)
//                    .build());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(ResponseObject.builder()
//                    .status(HttpStatus.BAD_REQUEST)
//                    .message(e.getMessage())
//                    .build());
//        }
//    }
//    @PatchMapping("/update-transaction")
//    public ResponseEntity<ResponseObject> updatePaymentTransactionId(@RequestBody UpdateTransactionDTO statusDto,
//                                                                     BindingResult result) {
//        if (result.hasErrors()) {
//            List<String> errorMessages = result.getFieldErrors()
//                    .stream()
//                    .map(FieldError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.badRequest().body(ResponseObject.builder()
//                    .status(HttpStatus.BAD_REQUEST)
//                    .message(errorMessages.toString())
//                    .build());
//        }
//        try {
//            PaymentResponse paymentResponse = paymentService.updatePaymentTransactionId(statusDto);
//            return ResponseEntity.ok(ResponseObject.builder()
//                    .status(HttpStatus.OK)
//                    .message(localizationUtils.getLocalizedMessage(
//                            MessageKeys.PAYMENT_UPDATE_SUCCESSFULLY))
//                    .data(paymentResponse)
//                    .build());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(ResponseObject.builder()
//                    .status(HttpStatus.BAD_REQUEST)
//                    .message(e.getMessage())
//                    .build());
//        }
//    }
//
//    @PostMapping("/query")
//    public ResponseEntity<ResponseObject> queryTransaction(
//            @RequestBody PaymentQueryDTO paymentQueryDto,
//            HttpServletRequest request) {
//        try {
//            String result = vnPayService.queryTransaction(paymentQueryDto, request);
//            return ResponseEntity.status(HttpStatus.CREATED).
//                    body(ResponseObject.builder()
//                            .status(HttpStatus.OK)
//                            .message(localizationUtils.getLocalizedMessage(MessageKeys.PAYMENT_QUERY_SUCCESSFULLY))
//                            .data(result)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .message(localizationUtils.getLocalizedMessage(
//                            MessageKeys.PAYMENT_ERROR_QUERY_TRANSACTION, e.getMessage()))
//                    .build());
//        }
//    }
//
//    @PostMapping("/refund")
//    public ResponseEntity<ResponseObject> refundTransaction(
//            @Valid @RequestBody PaymentRefundDTO paymentRefundDTO,
//            BindingResult result) {
//        if (result.hasErrors()) {
//            List<String> errorMessages = result.getFieldErrors()
//                    .stream()
//                    .map(FieldError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.badRequest().body(ResponseObject.builder()
//                    .message(String.join(", ", errorMessages))
//                    .status(HttpStatus.BAD_REQUEST)
//                    .data(null)
//                    .build());
//        }
//
//        try {
//            String response = vnPayService.refundTransaction(paymentRefundDTO);
//            return ResponseEntity.status(HttpStatus.CREATED).
//                    body(ResponseObject.builder()
//                            .message(localizationUtils.getLocalizedMessage(
//                                    MessageKeys.PAYMENT_REFUND_QUERY_TRANSACTION))
//                            .status(HttpStatus.OK)
//                            .data(response)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
//                    .message(localizationUtils.getLocalizedMessage(
//                            MessageKeys.PAYMENT_REFUND_FAILED, e.getMessage()))
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .data(null)
//                    .build());
//        }
//    }
//    @GetMapping("/transaction/{transactionId}")
//    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
//    public ResponseEntity<ResponseObject> getOrderIdByTransactionId( @PathVariable String transactionId ){
//        try {
//            Long orderId = paymentService.getOrderIdByTransactionId(transactionId);
//            return ResponseEntity.ok(ResponseObject.builder()
//                    .status(HttpStatus.OK)
//                    .data(Collections.singletonMap("order_id", orderId))
//                    .message(localizationUtils.getLocalizedMessage(
//                            MessageKeys.ORDER_RETRIEVED_SUCCESSFULLY))
//                    .build());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(ResponseObject.builder()
//                    .status(HttpStatus.BAD_REQUEST)
//                    .data(null)
//                    .message(e.getMessage())
//                    .build());
//        }
//    }
}




