import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import extractRoutes from "./routes/extractRoutes.js"
import tailorRoutes from "./routes/tailorRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();

/* ======================================================
   Middleware
====================================================== */

app.use(
    cors({
        origin: "*",
        credentials: true
    })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}));

/* ======================================================
   Health Check
====================================================== */

app.get("/", (req, res) => {

    res.json({
        success: true,
        service: "Axyres Extension AI Backend",
        version: "2.0.0",
        status: "Running"
    });

});

app.get("/health", (req, res) => {

    res.json({

        success: true,

        uptime: process.uptime(),

        timestamp: new Date(),

        memory: process.memoryUsage()

    });

});

/* ======================================================
   Routes
====================================================== */

app.use("/generated", express.static("generated"));

app.use("/api/extract", extractRoutes);

app.use("/api/tailor", tailorRoutes);

app.use("/api/pdf", pdfRoutes);

/* ======================================================
   404
====================================================== */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});

/* ======================================================
   Error Handler
====================================================== */

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});

/* ======================================================
   Server
====================================================== */

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

    console.log(`
==========================================
 AXYRES EXTENSION AI BACKEND
==========================================

 Running : http://localhost:${PORT}

 Health  : /health

 Extract : /api/extract

 Tailor  : /api/tailor

 PDF      : /api/pdf

==========================================
`);

});