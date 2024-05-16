// ToastComponent.tsx
"use client"
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Toast } from "primereact/toast";
import { hideToast } from "@/store/slices/Toast";

const ToastComponent: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { severity, summary, detail, visible } = useSelector(
        (state: RootState) => state.toast
    );

    const toastRef = useRef<any>(null);

    useEffect(() => {
        if (visible) {
            toastRef.current.show({
                severity,
                summary,
                detail,
            });
            dispatch(hideToast());
        }
    }, [visible, severity, summary, detail, dispatch]);

    return <Toast className=" z-50" ref={toastRef} />;
};

export default ToastComponent;
