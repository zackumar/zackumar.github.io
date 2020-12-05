const objToLoad = whoami
const spacing = 2
const isArrSingleLine = false

const consoleMessage = `---------------------------------
🖐️ HELLO! Strange seeing ya here. 
---------------------------------
If you wanna edit whoami,
you can edit the 'whoami' 
variable and use the load() 
function.

load() takes in an object,
tab width, and if you want to
display arrays on a single line.

There is a reason it isn't a
constant 😁.

- Zack Umar ❤️
---------------------------------
`
console.log(consoleMessage)

load(objToLoad, spacing, isArrSingleLine)

window.onresize = (e) => {
    load(objToLoad, spacing, isArrSingleLine)
}

//Turns object to Javascript Object String (Not really JSON)
function objectToJSON(obj, space, isArrSingleLine) {
    if (!space) space = 4
    if (!isArrSingleLine) isArrSingleLine = false

    return objectToJsonRecursive(obj, space, space, 0, isArrSingleLine)
}

//Recursive function for objectToJson (Not the most effecient thing. But it works and it's fast)
//FIXME: ADD isOnSingleLine AND REMOVE newSpacing. (OBSOLETE BUT EFFECTS STUFF WHEN REMOVED?)
function objectToJsonRecursive(obj, spacing, newSpacing, depth, isOnSingleLine) {
    let value = []

    let defaultTab = getTab(spacing * (depth + 1))
    let bracketTab = getTab(spacing * depth)

    switch (typeof obj) {
        case 'string':
            value.push(`<span class="value">'${obj}'</span>`)
            break
        case 'number':
        case 'boolean':
            value.push(`<span class="value">${obj}</span>`)
            break
        case 'object':
            if (Array.isArray(obj)) {
                value.push(`[`)
                obj.forEach((e) => {
                    value.push(`${defaultTab}${objectToJsonRecursive(e, spacing, null, depth + 1, isOnSingleLine)},`)
                })
                value.push(`${bracketTab}]`)
            } else {
                value.push(`{`)
                Object.keys(obj).forEach((key) => {
                    value.push(`${defaultTab}<span class="key">${key}</span>: ${objectToJsonRecursive(obj[key], spacing, null, depth + 1, isOnSingleLine)},`)
                })
                value.push(`${bracketTab}}`)
            }
            break
    }

    return value.join('\n')
}

//Helper function to make tabs
function getTab(spaces) {
    let tabs = ''
    for (let i = 0; i < spaces; i++) tabs += ' '
    return tabs
}

//Add whoami to html
function load(obj, spacing, isArrSingleLine) {
    let pre = document.createElement('pre')
    pre.id = 'content'
    pre.innerHTML = '<span class="keyword">let</span> <span class="name">whoami</span> <span class="equals">=</span> ' + objectToJSON(obj, spacing, isArrSingleLine)
    document.body.innerHTML = pre.outerHTML

    pre = document.getElementById('content')

    pre.style.top = `${window.innerHeight / 2 - pre.offsetHeight / 2 - 20}px`
    pre.style.left = `${window.innerWidth / 2 - pre.offsetWidth / 2}px`
}
