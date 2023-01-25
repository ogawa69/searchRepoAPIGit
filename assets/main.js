const searchLine = document.querySelector('.search__line')
const dropList = document.querySelector('.search__drop-list')
const selected = document.querySelector('.selected')

function createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
}

function createSearchRes(userData) {

    const searchRes = document.createElement('li')
    searchRes.classList.add('search__item')
    searchRes.textContent = userData.name
    dropList.append(searchRes)

    searchRes.addEventListener('click', () => {
        searchLine.value = ''
        clearResult()
        createSelectedItem(userData)
    })
}

function createSelectedItem(userData) {
    const selectedItem = document.createElement('div')
    selectedItem.classList.add('selected__item')
    const selectedInfo = document.createElement('div')
    selectedInfo.classList.add('selected__info')
    selectedInfo.textContent = 
    `Name: ${userData.name}\nOwner: ${userData.owner.login}\nStars: ${userData.stargazers_count}`
    const removeBtn = document.createElement('button')
    removeBtn.src = './assets/close.svg'
    removeBtn.classList.add('selected__remove')
    selectedItem.append(selectedInfo, removeBtn)
    selected.append(selectedItem)

    removeBtn.addEventListener('click', () => {
        selectedItem.remove()
    })
}

const url = 'https://api.github.com/search/repositories'

async function getRepositories(searchValue) {
    try {
        const response = await fetch(`${url}?q=${searchValue}&per_page=5`)
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}

async function searchUsers() {
    const searchValue = searchLine.value
    if (!searchValue) {
        return
    }
    getRepositories(searchValue).then(res => {
        clearResult()
        res.items.forEach(el => createSearchRes(el));
    })
}

function clearResult() {
    document.querySelectorAll('.search__item').forEach(el => el.remove())
}

function debounce(fn, debounceTime) {
    let timer
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(x => {
            fn.apply(this, args)
        }, debounceTime)
    }
};

searchLine.addEventListener('keyup', function() {
    debounce(searchUsers.bind(this), 400).bind(this)()
})
