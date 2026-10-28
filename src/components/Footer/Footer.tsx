"use client";

import { motion } from "framer-motion";
import Text from "@/src/components/Text/Text";

const BG = "#FAFADC";
const BLUE = "#5a7a8a";
const RED = "#7D0103";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="border-t-2 px-5 py-5 lg:py-6 text-center text-sm lg:text-[15px]"
            style={{ backgroundColor: BG, borderColor: RED, color: BLUE }}
        >
            <Text>© {new Date().getFullYear()} Guará Estúdio. Todos os direitos reservados.</Text>
        </motion.footer>
    );
}