const promptInput =
document.getElementById(
    "promptInput"
);

const generateBtn =
document.getElementById(
    "generateBtn"
);

const results =
document.getElementById(
    "results"
);

const loader =
document.getElementById(
    "loader"
);

const charCount =
document.getElementById(
    "charCount"
);

const historyToggle =
document.getElementById(
    "historyToggle"
);

const historyList =
document.getElementById(
    "history-list"
);


/* --------------------------
   Character Counter
-------------------------- */

promptInput.addEventListener(
    "input",
    () => {

        charCount.innerText =
        promptInput.value.length;

    }
);


/* --------------------------
   Style Chips
-------------------------- */

let selectedStyle =
"Photorealistic";

document
.querySelectorAll(
".style-chip"
)
.forEach(
chip => {

    chip.addEventListener(
        "click",
        () => {

            document
            .querySelectorAll(
            ".style-chip"
            )
            .forEach(
            c =>
            c.classList.remove(
            "active"
            )
            );

            chip.classList.add(
            "active"
            );

            selectedStyle =
            chip.dataset.style;
        }
    );

}
);


/* --------------------------
   History Toggle
-------------------------- */

historyToggle.addEventListener(
    "click",
    () => {

        if(
            historyList.style.display
            ===
            "block"
        ){

            historyList.style.display =
            "none";

            historyToggle.innerText =
            "Recent Prompts ▼";
        }

        else{

            historyList.style.display =
            "block";

            historyToggle.innerText =
            "Recent Prompts ▲";
        }
    }
);


/* --------------------------
   Generate Prompt
-------------------------- */

generateBtn.addEventListener(
    "click",
    async () => {

        const prompt =
        promptInput.value.trim();

        if(!prompt){

            alert(
            "Please enter a prompt."
            );

            return;
        }

        results.innerHTML = "";

        loader.classList.remove(
        "hidden"
        );

        try{

            const response =
            await fetch(
                "/enhance",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(
                    {
                        prompt:
                        prompt,

                        style:
                        selectedStyle
                    })
                }
            );

            const data =
            await response.json();

            loader.classList.add(
            "hidden"
            );

            if(!data.success){

                results.innerHTML = `
                <div class="prompt-card">
                    <h3>Error</h3>
                    <p>${data.message}</p>
                </div>
                `;

                return;
            }

            renderVersions(
                data.response
            );

        }

        catch(error){

            loader.classList.add(
            "hidden"
            );

            results.innerHTML = `
            <div class="prompt-card">
                <h3>Error</h3>
                <p>${error}</p>
            </div>
            `;
        }
    }
);


/* --------------------------
   Parse Versions
-------------------------- */

function renderVersions(text){

    const sections =
    text.split(
    /VERSION\s+\d+/i
    );

    const cleanSections =
    sections.filter(
    section =>
    section.trim() !== ""
    );

    cleanSections.forEach(
    (
    section,
    index
    ) => {

        const promptMatch =
        section.match(
        /PROMPT:\s*([\s\S]*?)REASON:/i
        );

        const reasonMatch =
        section.match(
        /REASON:\s*([\s\S]*)/i
        );

        const promptText =
        promptMatch
        ?
        promptMatch[1].trim()
        :
        "Prompt not found";

        const reasonText =
        reasonMatch
        ?
        reasonMatch[1].trim()
        :
        "Reason not found";

        const card =
        document.createElement(
        "div"
        );

        card.className =
        "prompt-card";

        card.innerHTML = `

            <h3>
                Version ${index+1}
            </h3>

            <div class="prompt-box">

                ${promptText}

            </div>

            <div class="reason-box">

                ${reasonText}

            </div>

            <button
            class="copy-btn">

            Copy Prompt

            </button>

        `;

        results.appendChild(
        card
        );

        const copyBtn =
        card.querySelector(
        ".copy-btn"
        );

        copyBtn.addEventListener(
            "click",
            () => {

                navigator
                .clipboard
                .writeText(
                promptText
                );

                copyBtn.innerText =
                "✓ Copied";

                setTimeout(
                    () => {

                        copyBtn.innerText =
                        "Copy Prompt";

                    },
                    2000
                );
            }
        );

    });

}


/* --------------------------
   History Click
-------------------------- */

document.addEventListener(
    "click",
    event => {

        if(
            event.target.classList.contains(
            "history-item"
            )
        ){

            promptInput.value =
            event.target.innerText;

            charCount.innerText =
            promptInput.value.length;

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });
        }
    }
);