import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import App from "./App";
import Navbar from "./components/Navbar";
import ToastComponent from "./components/ToastComponent";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Academic Ledger: The Private Tutor's Companion",
	description:
		"Streamline your educational endeavors with Academic Ledger, the intuitive web app designed to bring order to your tutoring world.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="text-[#eee]">
			<body className={inter.className}>
				<App>{children}</App>
			</body>
		</html>
	);
}
