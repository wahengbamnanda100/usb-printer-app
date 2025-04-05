const express = require("express");
const cors = require("cors");
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const path = require("path");
const usb = require("usb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve React build (for production)
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.post("/api/print", async (req, res) => {
	const devices = usb.getDeviceList();

	devices.forEach((device, index) => {
		const { idVendor, idProduct, deviceDescriptor } = device;

		console.log(`Device #${index + 1}`);
		console.log(`Vendor ID: 0x${idVendor.toString(16)}`);
		console.log(`Product ID: 0x${idProduct.toString(16)}`);
		console.log("-------------");
	});

	const printer = new ThermalPrinter({
		type: PrinterTypes.EPSON,
		interface: "usb",
	});

	printer.alignCenter();
	printer.println("Demo Store");
	printer.drawLine();
	printer.println("Item 1     $5.00");
	printer.println("Item 2     $7.00");
	printer.drawLine();
	printer.println("Total      $12.00");
	printer.cut();

	try {
		const isConnected = await printer.isPrinterConnected();
		if (!isConnected) return res.status(500).send("Printer not connected");

		await printer.execute();
		res.send("Printed successfully!");
	} catch (err) {
		console.error(err);
		res.status(500).send("Print failed");
	}
});

app.get(/^\/(?!api).*/, (req, res) => {
	res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

app.listen(PORT, () =>
	console.log(`🖨️ Server running on http://localhost:${PORT}`)
);
