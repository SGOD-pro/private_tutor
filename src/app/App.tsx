"use client"
import React from "react";
import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/themes/lara-dark-green/theme.css';
import 'primeicons/primeicons.css';
import { Provider } from "react-redux";
import store from "../store/store";
function App({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<PrimeReactProvider>
			<Provider store={store}>{children}</Provider>
		</PrimeReactProvider>
	);
}

export default App;
