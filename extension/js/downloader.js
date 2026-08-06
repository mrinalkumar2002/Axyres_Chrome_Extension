// ==========================================
// AXYRES Downloader Module
// ==========================================

const Downloader = (() => {

    const DEFAULT_FILE_NAME = "Axyres_Resume.pdf";

    // ==========================================
    // Download From URL
    // ==========================================

    async function download(pdfUrl, fileName = DEFAULT_FILE_NAME) {

        return ErrorHandler.wrap(async () => {

            Logger.info("Downloading PDF from URL");

            if (Validator.isEmpty(pdfUrl)) {

                return ErrorHandler.handle(
                    "PDF URL is missing.",
                    { showUI: false }
                );

            }

            const downloadId = await chrome.downloads.download({

                url: pdfUrl,

                filename: fileName,

                saveAs: true

            });

            Logger.info("Download Started");

            Logger.debug("Download ID", downloadId);

            return {

                success: true,

                downloadId

            };

        });

    }

    // ==========================================
    // Download Base64 PDF
    // ==========================================

    async function downloadBase64(base64, fileName = DEFAULT_FILE_NAME) {

        return ErrorHandler.wrap(async () => {

            Logger.info("Downloading Base64 PDF");

            if (Validator.isEmpty(base64)) {

                return ErrorHandler.handle(
                    "Base64 PDF is missing.",
                    { showUI: false }
                );

            }

            const url = `data:application/pdf;base64,${base64}`;

            const downloadId = await chrome.downloads.download({

                url,

                filename: fileName,

                saveAs: true

            });

            Logger.info("Download Started");

            Logger.debug("Download ID", downloadId);

            return {

                success: true,

                downloadId

            };

        });

    }

    // ==========================================
    // Download Blob PDF
    // ==========================================

    async function downloadBlob(blob, fileName = DEFAULT_FILE_NAME) {

        return ErrorHandler.wrap(async () => {

            Logger.info("Downloading Blob PDF");

            if (!blob) {

                return ErrorHandler.handle(
                    "Blob is missing.",
                    { showUI: false }
                );

            }

            const url = URL.createObjectURL(blob);

            try {

                const downloadId =
                    await chrome.downloads.download({

                        url,

                        filename: fileName,

                        saveAs: true

                    });

                Logger.info("Download Started");

                Logger.debug("Download ID", downloadId);

                return {

                    success: true,

                    downloadId

                };

            }

            finally {

                URL.revokeObjectURL(url);

                Logger.debug("Blob URL Released");

            }

        });

    }

    // ==========================================
    // Smart Download
    // ==========================================

    async function save(pdf, fileName = DEFAULT_FILE_NAME) {

        Logger.info("Selecting Download Method");

        const validation =
            Validator.validatePDF(pdf);

        if (!validation.valid) {

            return ErrorHandler.handle(
                validation.message,
                { showUI: false }
            );

        }

        if (pdf.pdfUrl) {

            return download(
                pdf.pdfUrl,
                fileName
            );

        }

        if (pdf.pdf) {

            if (pdf.pdf instanceof Blob) {

                return downloadBlob(
                    pdf.pdf,
                    fileName
                );

            }

            return downloadBase64(
                pdf.pdf,
                fileName
            );

        }

        return ErrorHandler.handle(

            "Unsupported PDF format.",

            { showUI: false }

        );

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        download,

        downloadBase64,

        downloadBlob,

        save

    };

})();