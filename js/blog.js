function getQueryParams() {
    let queryString = {}
    $(window.location.search.substr(1).split('&')).each((i, e) => {
        if (e === '') return
        let pair = e.split('=')
        queryString[pair[0]] = pair[1] && decodeURIComponent(pair[1].replace(/\+/g, ' '))
    })

    return queryString
}

async function getPostInfo() {
    let postsFilesHrefs = []

    try {
        await $.get('./blog', (data) => {
            $(data)
                .find('ul[id="files"] > li > a')
                .each((i, e) => {
                    let element = $(e)
                    if (element.attr('href') === '/') return
                    postsFilesHrefs.push({
                        title: element.attr('title').slice(20, -3).replace(/-/g, ' '),
                        href: element.attr('href'),
                        date: new Date(element.attr('title').slice(0, 19).replace(/_/g, ':')),
                    })
                })
        })
    } catch (e) {
        console.error(e)
    }

    return postsFilesHrefs
}

async function loadMainPost(postInfo, queryParams) {
    let currentArticleInfo

    if (queryParams && queryParams.title) {
        currentArticleInfo = postInfo.find((e) => {
            return e.title === queryParams.title
        })
    }

    if (currentArticleInfo === undefined) {
        currentArticleInfo = postInfo.reduce((a, b) => (a.date.getTime() > b.date.getTime() ? a : b))
    }

    await $.get(currentArticleInfo.href, (data) => {
        $('main').html(marked(data))
    })
}

function categorizePosts(postInfo) {
    let categories = {}

    $(postInfo).each((i, e) => {
        if (!categories[e.date.getFullYear()]) categories[e.date.getFullYear()] = {}
        if (!categories[e.date.getFullYear()][e.date.getMonth()]) categories[e.date.getFullYear()][e.date.getMonth()] = []
        categories[e.date.getFullYear()][e.date.getMonth()].push(e)
    })

    return categories
}

;(async () => {
    let postInfo = await getPostInfo()
    let queryParams = getQueryParams()

    await loadMainPost(postInfo, queryParams)

    let now = new Date()
    $('h3#currentmonthtitle').html(`${now.toLocaleString('default', { month: 'long' })}'s Entries`)

    $(postInfo).each((i, e) => {
        if (e.date.getFullYear() === now.getFullYear() && e.date.getMonth() === now.getMonth()) {
            let href = `<a href="?title=${e.title}"> <p>${e.title}</p><hr><time>${e.date.getDate()}</time></a>`
            $('div#currentmonthentries').append(href)
        }
    })

    console.log(categorizePosts(postInfo))
})()
