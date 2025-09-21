"use client";
import { Btn } from "./btn";
import { AnimatePresence, motion } from "framer-motion";

export default function Confirm({ isShow, text, warningTxt, onOk, onCancel }) {
  const varients = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.4 },
    },
    visible: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AnimatePresence>
      {isShow && (
        <motion.section
          variants={varients}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 flex justify-center items-start pt-5 bg-black/40 z-50"
        >
          <div className="bg-white p-5 rounded-xl">
            <div className="mb-5 text-center">
              <p className="text-lg">{text}</p>
              <p className="text-red-500">{warningTxt}</p>
            </div>
            <div className="flex gap-2.5 justify-center">
              <div>
                <Btn onClick={onOk}>تایید</Btn>
              </div>
              <div>
                <Btn color="red" onClick={onCancel}>
                  انصراف
                </Btn>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
