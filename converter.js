document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        let buffer = new Uint8Array(e.target.result);
        const peOffset = buffer[0x3C] | (buffer[0x3D] << 8);
        if (peOffset === 0 || peOffset > buffer.length) {
            document.getElementById("output").textContent = "Invalid PE file: Corrupt or missing header.";
            return;
        }

        const peSignature = String.fromCharCode(...buffer.slice(peOffset, peOffset + 4));
        if (peSignature !== "PE\0\0") {
            document.getElementById("output").textContent = "Not a valid PE file.";
            return;
        }

        let machineType = buffer[peOffset + 4] | (buffer[peOffset + 5] << 8);
        let originalArch = "Unknown";
        let convertedArch = "Unknown";
        if (machineType === 0x014C) originalArch = "32-bit (x86)";
        else if (machineType === 0x8664) originalArch = "64-bit (x86_64)";

        const numberOfSections = buffer[peOffset + 6] | (buffer[peOffset + 7] << 8);
        const entryPoint = buffer[peOffset + 40] | (buffer[peOffset + 41] << 8) | (buffer[peOffset + 42] << 16) | (buffer[peOffset + 43] << 24);
        const subsystem = buffer[peOffset + 92] | (buffer[peOffset + 93] << 8);
        let subsystemType = "Unknown";
        if (subsystem === 2) subsystemType = "Windows GUI";
        else if (subsystem === 3) subsystemType = "Windows Console";
        
        let textSectionOffset = 0;
        let textSectionSize = 0;
        let dataSectionOffset = 0;
        let dataSectionSize = 0;
        let sectionHeaderStart = peOffset + 248;
        
        for (let i = 0; i < numberOfSections; i++) {
            const sectionOffset = sectionHeaderStart + i * 40;
            const name = String.fromCharCode(...buffer.slice(sectionOffset, sectionOffset + 8)).replace(/\x00/g, "");
            const rawDataOffset = buffer[sectionOffset + 20] | (buffer[sectionOffset + 21] << 8) | (buffer[sectionOffset + 22] << 16) | (buffer[sectionOffset + 23] << 24);
            const rawDataSize = buffer[sectionOffset + 16] | (buffer[sectionOffset + 17] << 8) | (buffer[sectionOffset + 18] << 16) | (buffer[sectionOffset + 19] << 24);
            
            if (name === ".text") {
                textSectionOffset = rawDataOffset;
                textSectionSize = rawDataSize;
            }
            if (name === ".data") {
                dataSectionOffset = rawDataOffset;
                dataSectionSize = rawDataSize;
            }
        }

        let textSection = textSectionSize > 0 ? buffer.slice(textSectionOffset, textSectionOffset + textSectionSize) : new Uint8Array();
        let dataSection = dataSectionSize > 0 ? buffer.slice(dataSectionOffset, dataSectionOffset + dataSectionSize) : new Uint8Array();

        let originalTextSection = textSection.slice();
        let originalDataSection = dataSection.slice();

        for (let i = 0; i < textSection.length; i++) {
            if (textSection[i] === 0x48) {
                textSection[i] = 0x90;
            }
        }

        if (machineType === 0x8664) {
            buffer[peOffset + 4] = 0x4C;
            buffer[peOffset + 5] = 0x01;
            convertedArch = "Converted to 32-bit (x86)";
        } else {
            convertedArch = originalArch;
        }

        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "converted_32bit.exe";
        link.textContent = "Download Converted 32-bit EXE";

        document.getElementById("output").innerHTML = `
            <strong>Original Information:</strong><br>
            Architecture: ${originalArch}<br>
            Sections: ${numberOfSections}<br>
            Entry Point: 0x${entryPoint.toString(16)}<br>
            Subsystem: ${subsystemType}<br>
            <br>
            <strong>Converted Information:</strong><br>
            Architecture: ${convertedArch}<br>
            <br>
            <strong>Original .text Section (First 20 bytes):</strong> ${originalTextSection.length > 0 ? Array.from(originalTextSection.slice(0, 20)).map(b => b.toString(16).padStart(2, "0")).join(" ") : "N/A"}<br>
            <strong>Converted .text Section (First 20 bytes):</strong> ${textSection.length > 0 ? Array.from(textSection.slice(0, 20)).map(b => b.toString(16).padStart(2, "0")).join(" ") : "N/A"}<br>
            <br>
            <strong>Original .data Section (First 20 bytes):</strong> ${originalDataSection.length > 0 ? Array.from(originalDataSection.slice(0, 20)).map(b => b.toString(16).padStart(2, "0")).join(" ") : "N/A"}<br>
            <strong>Converted .data Section (First 20 bytes):</strong> ${dataSection.length > 0 ? Array.from(dataSection.slice(0, 20)).map(b => b.toString(16).padStart(2, "0")).join(" ") : "N/A"}<br>
            <br>
        `;
        document.getElementById("output").appendChild(link);
    };
    reader.readAsArrayBuffer(file);
});

