document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log("Review JS Loaded");


        const result =
            await chrome.storage.local.get(
                "tailoredResume"
            );


        const resume =
            result.tailoredResume;


        console.log(
            "RESUME USED FOR UI:",
            resume
        );


        const container =
            document.getElementById(
                "resumeContainer"
            );


        if (!resume) {

            container.innerHTML =
                "No resume found.";

            return;

        }


        container.innerHTML = `

        <div class="resume-preview">


            <h1>
                ${resume.personalInfo?.name || ""}
            </h1>


            <p>
                ${resume.personalInfo?.email || ""}
            </p>


            <p>
                ${resume.personalInfo?.phone || ""}
            </p>


            <hr>



            <h2>
                Professional Summary
            </h2>


            <p>
            ${
                resume.summary?.description ||
                resume.summary?.headline ||
                "No summary available"
            }
            </p>




            <h2>
                Technical Skills
            </h2>


            <ul>

            ${
                (resume.technicalSkills || [])
                .map(skill => `

                    <li>
                        ${skill}
                    </li>

                `)
                .join("")
            }

            </ul>




            <h2>
                Work Experience
            </h2>


            ${
                (resume.workExperience || [])
                .map(exp => `


                <div class="experience">


                    <h3>
                    ${exp.position || ""}
                    </h3>


                    <p>
                    ${exp.company || ""}
                    </p>


                    <p>
                    ${exp.duration || ""}
                    </p>



                    <h4>
                    Responsibilities
                    </h4>


                    <ul>

                    ${
       (
    Array.isArray(exp.responsibilities)
        ? exp.responsibilities
        : [exp.responsibilities]
)
.filter(Boolean)
                        .map(item => `

                            <li>
                            ${item}
                            </li>

                        `)
                        .join("")
                    }

                    </ul>



                    <h4>
                    Achievements
                    </h4>


                    <ul>

                    ${
                 (
    Array.isArray(exp.achievements)
        ? exp.achievements
        : [exp.achievements]
)
.filter(Boolean)
.map(item => `

    <li>
        ${item}
    </li>

`)
.join("")
                    }

                    </ul>


                </div>


                `)
                .join("")
            }





            <h2>
                Projects
            </h2>



            ${
                (resume.projects || [])
                .map(project => `


                <div class="project">


                    <h3>
                    ${project.name || project.title || ""}
                    </h3>


                    <p>
                    ${project.description || ""}
                    </p>



                    <p>

                    Technologies:

                    ${
                        Array.isArray(project.technologies)

                        ?

                        project.technologies.join(", ")

                        :

                        project.technologies || ""

                    }

                    </p>


                </div>


                `)
                .join("")
            }


        </div>

        `;


    }
);