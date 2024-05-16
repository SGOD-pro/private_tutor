"use client";
import React, { useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-dark-green/theme.css";
import "primeicons/primeicons.css";
import { Provider } from "react-redux";
import store from "../store/store";
import Main from "./Main";
function App({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<PrimeReactProvider>
			<Provider store={store}>
				<Main>{children}</Main>
			</Provider>
		</PrimeReactProvider>
	);
}

export default App;
