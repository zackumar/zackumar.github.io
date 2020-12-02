//Turns object to Javascript Object String (Not really JSON)
function objectToJSON(obj, tabAmount, isArrSingleLine) {
    if (!tabAmount) tabAmount = 4
    if (!isArrSingleLine) isArrSingleLine = false

    return convert(obj, tabAmount, tabAmount, isArrSingleLine)
}

//Recursive function for objectToJson (Not the most effecient thing. But it works and it's fast)
function convert(obj, tab, originalTab, isArrSingleLine) {
    let root = []

    root.push('{')

    Object.keys(obj).forEach((key) => {
        let value = obj[key]
        let pair = []

        pair.push(`<span class="key">${getTab(tab)}${key}</span>`)
        switch (typeof value) {
            case 'string':
            case 'number':
                pair.push(`<span class="value">'${value}',</span>`)
                break
            case 'object':
                if (Array.isArray(obj[key])) {
                    let arr = []
                    obj[key].forEach((e) => {
                        arr.push(`<span class="value">${isArrSingleLine ? `'${e}'` : getTab(tab + originalTab) + `'${e}'` + ','}</span>`)
                    })
                    pair.push(`[${isArrSingleLine ? ' ' : '\n'}${isArrSingleLine ? arr.join(', ') : arr.join('\n')}${isArrSingleLine ? ', ' : `\n${getTab(tab)}`}],`)
                } else {
                    pair.push(convert(value, tab * 2, tab, isArrSingleLine))
                }
                break
        }
        root.push(pair.join(': '))
    })

    root.push(originalTab != tab ? `${getTab(tab - originalTab)}},` : '}')
    return root.join('\n')
}

//Helper function to make tabs
function getTab(spaces) {
    let tabs = ''
    for (let i = 0; i < spaces; i++) tabs += ' '
    return tabs
}

//Add whoami to html
function load(isArrSingleLine) {
    let pre = document.createElement('pre')
    pre.id = 'content'
    pre.innerHTML = '<span class="keyword">let</span> <span class="name">whoami</span> = ' + objectToJSON(whoami, 4, isArrSingleLine)
    document.body.innerHTML = pre.outerHTML

    pre = document.getElementById('content')

    pre.style.top = `${window.innerHeight / 2 - pre.offsetHeight / 2 - 20}px`
    pre.style.left = `${window.innerWidth / 2 - pre.offsetWidth / 2}px`
}

//Load

const consoleMessage = `---------------------------------
🖐️ HELLO! Strange seeing ya here. 
---------------------------------
If you wanna edit the whoami,
you can edit 'whoami' variable
and use the load() function.

There is a reason it isn't a
constant 😁.

- Zack Umar ❤️
---------------------------------
`
console.log(consoleMessage)

load(false)

window.onresize = (e) => {
    load(false)
}
