package com.project.Shopapp.utils;

import com.project.Shopapp.models.OrderStatus;

public class OrderStatusUtils {
    private static final String[] VALID_STATUSES = {
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPED,
            OrderStatus.DELIVERED,
            OrderStatus.CANCELLED
    };

    public static boolean isValidStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return false;
        }
        for (String validStatus : VALID_STATUSES) {
            if (validStatus.equals(status.trim())) {
                return true;
            }
        }
        return false;
    }

    public static void validateStatus(String status) throws IllegalArgumentException {
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status. Must be one of: " +
                    String.join(", ", VALID_STATUSES));
        }
    }
}
