import axios from "axios";

function App() {
	const handlePrint = async () => {
		try {
			const res = await axios.post("/api/print");
			alert(res.data);
		} catch (err) {
			console.error(err);
			if (axios.isAxiosError(err) && err.response) {
				alert(err.response.data); // ✅ error message from server like "Printer not connected"
			} else {
				alert("An unexpected error occurred."); // ✅ fallback
			}
		}
	};

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<h1>USB Thermal Printer (Monolithic App)</h1>
			<button onClick={handlePrint}>Print Receipt</button>
		</div>
	);
}

export default App;
