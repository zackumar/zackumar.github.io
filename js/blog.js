const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getQueryParams() {
    let queryString = {}
    window.location.search
        .substr(1)
        .split('&')
        .forEach((e) => {
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
    let categories = {
        years: [],
    }

    postInfo.forEach((e) => {
        if (!categories[e.date.getFullYear()]) {
            categories['years'].push(e.date.getFullYear())
            categories[e.date.getFullYear()] = {
                months: [],
            }
        }
        if (!categories[e.date.getFullYear()][e.date.getMonth()]) {
            categories[e.date.getFullYear()]['months'].push(e.date.getMonth())
            categories[e.date.getFullYear()][e.date.getMonth()] = []
        }
        categories[e.date.getFullYear()][e.date.getMonth()].push(e)
    })

    return categories
}

;(async () => {
    let postInfo = await getPostInfo()
    let queryParams = getQueryParams()

    await loadMainPost(postInfo, queryParams)

    postInfo = categorizePosts(postInfo)

    monthNames[postInfo[postInfo.years.slice().reverse()[0]].months.slice().reverse()[0]]

    let mostRecentYear = postInfo.years[postInfo.years.length - 1]
    let mostRecentMonth = postInfo[mostRecentYear].months[postInfo[mostRecentYear].months.length - 1]

    let recentMonthTitle = $('h3#recentmonthtitle')
    $('h3#recentmonthtitle').html(`${monthNames[mostRecentMonth]}'s Entries`)
    let href = ''

    postInfo[mostRecentYear][mostRecentMonth].forEach((e) => {
        href = `${href}<a class="current" href="?title=${e.title}"><p>${e.title}</p><hr><time>${e.date.getDate()}</time></a>`
    })

    recentMonthTitle.after(href)
    postInfo[mostRecentYear].months.pop()

    let detailsDiv = $('details')

    postInfo.years.reverse().forEach((year) => {
        postInfo[year].months.reverse().forEach((month, i) => {
            detailsDiv.append(i !== 0 ? `<h3><time>${monthNames[month]}</time></h3>` : `<h3><time>${year}</time><time>${monthNames[month]}</time></h3>`)
            postInfo[year][month].forEach((post) => {
                detailsDiv.append(`<a href="?title=${post.title}"><p>${post.title}</p><hr><time>${post.date.getDate()}</time></a>`)
            })
        })
    })
})()
