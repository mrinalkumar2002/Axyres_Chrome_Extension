// ==========================================
// AXYRES AI Module
// ==========================================

const AI = (() => {

    let extractedJob = null;
    let tailoredResume = null;
    let pdfBlob = null;

    // ==========================================
    // Extract Job Information
    // ==========================================

    async function extract(jobDescription) {

        return ErrorHandler.wrap(async () => {

            Logger.info("Starting AI Job Extraction");

            if (Validator.isEmpty(jobDescription)) {

                return ErrorHandler.handle(
                    "Job description is empty.",
                    { showUI: false }
                );

            }

            const response = await ExtensionApi.extract(jobDescription);

            const responseValidation =
                Validator.validateResponse(response);

            if (!responseValidation.valid) {

                return ErrorHandler.handle(
                    responseValidation.message,
                    { showUI: false }
                );

            }

            const data = response.data;

            if (!data.success) {

                return ErrorHandler.handle(
                    data.message || "AI extraction failed.",
                    { showUI: false }
                );

            }

            extractedJob = data.data || data.job || data;

            const jobValidation =
                Validator.validateJob(extractedJob);

            if (!jobValidation.valid) {

                return ErrorHandler.handle(
                    jobValidation.message,
                    { showUI: false }
                );

            }

            Logger.debug(
                "Extracted Job",
                extractedJob
            );

            return {

                success: true,

                job: extractedJob

            };

        });

    }

    // ==========================================
    // Tailor Resume
    // ==========================================

    async function tailor(resume, job) {

        return ErrorHandler.wrap(async () => {

            Logger.info("Tailoring Resume");

            const resumeValidation =
                Validator.validateResume(resume);

            if (!resumeValidation.valid) {

                return ErrorHandler.handle(
                    resumeValidation.message,
                    { showUI: false }
                );

            }

            const jobValidation =
                Validator.validateJob(job);

            if (!jobValidation.valid) {

                return ErrorHandler.handle(
                    jobValidation.message,
                    { showUI: false }
                );

            }

            const response = await ExtensionApi.tailor({

                resume,

                job

            });

            const responseValidation =
                Validator.validateResponse(response);

            if (!responseValidation.valid) {

                return ErrorHandler.handle(
                    responseValidation.message,
                    { showUI: false }
                );

            }

            const data = response.data;

            if (!data.success) {

                return ErrorHandler.handle(
                    data.message || "Unable to tailor resume.",
                    { showUI: false }
                );

            }

            tailoredResume =
                data.resume || data.data || data;

            Logger.debug(
                "Tailored Resume",
                tailoredResume
            );

            return {

                success: true,

                resume: tailoredResume

            };

        });

    }

    // ==========================================
    // Generate PDF
    // ==========================================

    async function generatePDF(resume) {

        return ErrorHandler.wrap(async () => {

            Logger.info("Generating Resume PDF");

            const validation =
                Validator.validateResume(resume);

            if (!validation.valid) {

                return ErrorHandler.handle(
                    validation.message,
                    { showUI: false }
                );

            }

            const response = await ExtensionApi.pdf({

                resume

            });

            const responseValidation =
                Validator.validateResponse(response);

            if (!responseValidation.valid) {

                return ErrorHandler.handle(
                    responseValidation.message,
                    { showUI: false }
                );

            }

            const data = response.data;

            if (!data.success) {

                return ErrorHandler.handle(
                    data.message || "Unable to generate PDF.",
                    { showUI: false }
                );

            }

            pdfBlob =
                data.pdf ||
                data.file ||
                data.pdfUrl ||
                data.data;

            const pdfValidation =
                Validator.validatePDF({

                    pdf: pdfBlob,

                    pdfUrl: data.pdfUrl

                });

            if (!pdfValidation.valid) {

                return ErrorHandler.handle(
                    pdfValidation.message,
                    { showUI: false }
                );

            }

            Logger.info("PDF Generated Successfully");

            return {

                success: true,

                pdf: pdfBlob,

                pdfUrl: data.pdfUrl || null

            };

        });

    }

    // ==========================================
    // Getters
    // ==========================================

    function getExtractedJob() {

        return extractedJob;

    }

    function getTailoredResume() {

        return tailoredResume;

    }

    function getPDF() {

        return pdfBlob;

    }

    // ==========================================
    // Clear Cache
    // ==========================================

    function clear() {

        Logger.debug("Clearing AI Cache");

        extractedJob = null;
        tailoredResume = null;
        pdfBlob = null;

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        extract,

        tailor,

        generatePDF,

        getExtractedJob,

        getTailoredResume,

        getPDF,

        clear

    };

})();