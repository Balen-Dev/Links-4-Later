let myLinks = [];

const inputEl = document.getElementById("input-el");
const saveInputBtn = document.getElementById("save-input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const saveLinkBtn = document.getElementById("save-link-btn");

const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"));

if (linksFromLocalStorage) {
    myLinks = linksFromLocalStorage;
    render(myLinks);
    makeCopyLinkFunctional()
    makeDeleteLinkFunctional()
}

saveLinkBtn.addEventListener("click", () => {

    chrome.tabs.query({active: true, currentWindow: true},(tabs) => {
    myLinks.push(tabs[0].url);
    localStorage.setItem("myLinks", JSON.stringify(myLinks));
    render(myLinks);
    });
});

function render(links) {
    let listItems = "";

    for (let i = 0; i < links.length; ++i) {
        listItems += `
        <li>
            <i class="fas fa-clipboard copy-link"></i>
            <i class='fa fa-trash delete-link'></i>
            <span>:</span>
            <a target="_blank" href="${links[i]}">
              ${links[i]}
            </a>
        </li>
        <hr/>
        `
    }

    ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", () => {
    localStorage.clear();
    myLinks = [];
    render(myLinks);
});

inputEl.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        saveInputBtn.click();
    }
});

saveInputBtn.addEventListener("click", () => {

    if (inputEl.value.length == 0) {
        return null
    } else {
        myLinks.push(inputEl.value);
        inputEl.value = null;
        localStorage.setItem("myLinks", JSON.stringify(myLinks));
        render(myLinks);
    }

});

function makeDeleteLinkFunctional() {
    const items = document.querySelectorAll('.delete-link')
        items.forEach((item, idx) => {
            item.addEventListener('click', () => {
                item.parentElement.remove()
                myLinks.splice(idx, 1)
                localStorage.setItem("myLinks", JSON.stringify(myLinks))
                render(myLinks)
            })
        })
}

function makeCopyLinkFunctional() {
    const items = document.querySelectorAll('.copy-link')
    items.forEach((item, idx) => {
        item.addEventListener('click', () => {
            let parent = item.parentNode
            let url = parent.querySelector('a').getAttribute('href')
            navigator.clipboard.writeText(url)
        })
    })
}

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
            makeCopyLinkFunctional()
            makeDeleteLinkFunctional()
        }
    })
})
observer.observe(ulEl, {
    childList: true
})