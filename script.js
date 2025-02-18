document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const buffer = new Uint8Array(e.target.result);
        const peOffset = buffer[0x3C] | (buffer[0x3D] << 8);
        const peSignature = String.fromCharCode(...buffer.slice(peOffset, peOffset + 4));

        if (peSignature !== "PE\0\0") {
            document.getElementById("output").textContent = "Not a valid PE file.";
            return;
        }

        const machineType = buffer[peOffset + 4] | (buffer[peOffset + 5] << 8);
        let arch = "Unknown";
        if (machineType === 0x014C) arch = "32-bit (x86)";
        else if (machineType === 0x8664) arch = "64-bit (x86_64)";

        document.getElementById("output").textContent = `PE Header Found\nArchitecture: ${arch}`;
    };
    reader.readAsArrayBuffer(file);
});

