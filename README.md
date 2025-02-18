# 64-bit to 32-bit EXE Converter

This project is a tool to convert 64-bit executables (EXEs) into 32-bit versions. It's designed to help users with legacy software or systems that require 32-bit executables. The process is complex, as it involves low-level file manipulation, but we’re starting by providing a basic frontend to upload and extract PE header details from EXE files.

## Technologies Used

- **WebAssembly (WASM)**: Used for handling low-level execution and manipulation of the executable files directly in the browser.
- **PE File Parser**: Analyzes the PE (Portable Executable) headers of the uploaded EXE to understand its structure and determine whether it is 64-bit.
- **x86 Emulator**: (Planned) To translate machine code from 64-bit to 32-bit instructions.
- **WebVM**: Once converted, 32-bit EXEs can be run in the browser using WebVM. Visit [WebVM](https://xpdevs.github.io/WebVM) for more information.

## How It Works

1. **Uploading the EXE**: Upload a 64-bit EXE file to the tool.
2. **PE Header Analysis**: The tool will extract and analyze the PE headers of the uploaded EXE to identify the structure and ensure it’s 64-bit.
3. **(Planned)** **Conversion Process**:
   - **Instruction Translation**: Modify machine code to use 32-bit instructions.
   - **Dependency Rewriting**: Re-link dependencies to use 32-bit DLLs instead of 64-bit ones.
   - **Repacking**: Repackage the EXE as a 32-bit version.
4. **Output**: The converted 32-bit EXE will be made available for download, and it can also be run in the browser via **WebVM**.

## Running 32-bit EXEs in the Browser

Once converted, you can run your 32-bit EXEs directly in your browser, thanks to **WebVM**, which allows compatibility for legacy software without worrying about system restrictions.

To learn more about WebVM, visit [WebVM](https://xpdevs.github.io/WebVM).

## Usage

1. **Upload your 64-bit EXE file** to the frontend tool.
2. **The tool extracts PE header details** to analyze the EXE’s structure.
3. **(Coming soon)** After analysis, the tool will begin converting the EXE to a 32-bit version.
4. **Download the 32-bit EXE** or use **WebVM** to run it directly in the browser.

## Contributing

This is a huge project, and we welcome contributions! Currently, the frontend is being developed to allow users to upload EXE files and extract PE headers. If you're interested in helping with the conversion process or have ideas for improvements, feel free to open an issue or submit a pull request.
