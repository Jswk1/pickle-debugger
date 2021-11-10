export function saveFile(content: string, fileName: string, contentType: "application/json" | "text/plain") {
    const linkElement = document.createElement("a");

    const file = new Blob([content], { type: contentType });

    linkElement.href = URL.createObjectURL(file);
    linkElement.download = fileName;
    linkElement.click();
}

export function loadFile(onContentLoaded: (content: string) => void) {
    const readAsText = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsText(file, "utf-8");
            reader.onload = (ev) => resolve(ev.target.result.toString());
            reader.onerror = () => reject(`Error reading file ${file.name}.`);
        });
    }

    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.addEventListener("change", async () => {
        if (inputElement.files.length > 0)
            readAsText(inputElement.files[0]).then(onContentLoaded);
    });

    inputElement.click();
}