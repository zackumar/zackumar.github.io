const mail = 'moc.liamg/2ramukcaz'.split('').reverse().join('').replace('/', '@')

let whoami = {
    name: 'Zack Umar',
    description: "Student working towards a Bachelor\\'s degree in CS",
    eductation: [
        {
            school: 'University of Texas at San Antonio',
            major: 'Computer Science',
            expected_graduation: 'May 2024',
            current_gpa: '3.92',
        },
    ],
    // my_thoughts: getLink('./blog.html', 'My Thoughts'),
    projects: [
        {
            project_name: '@newpaper_snippets',
            description:
                'An Instagram "bot" that posts snippets (advertisements, pictures, menus) from newspapers from exactly 100 years ago!\nCredit to the Library of Congress for archiving the papers!',
            instagram: getLink('https://www.instagram.com/newspaper_snippets/', '@newspaper_snippets'),
            github: getLink('https://github.com/zackumar/newspaper_snippets'),
        },
        getLink('https://github.com/zackumar/Belnades', 'belnades'),
        getLink('https://github.com/zackumar/txconnect-api', 'txconnect-api'),
        getLink('https://github.com/zackumar', 'more on github...'),
    ],
    contact: [getLink(mail, mail), getLink('https://www.linkedin.com/in/zackumar/', 'linkedin')],
    other_links: [getLink('https://github.com/zackumar', 'github'), getLink('https://twitter.com/mcgoodmen', 'twitter')],
}

function getLink(url, textToDisplay) {
    return `<a class="item" href="${url}">${textToDisplay ? textToDisplay : url}</a>`
}

let test = {
    string: 'string',
    number: 2.03,
    boolean: true,
    array: ['This', 'Is', 'An', 'Array'],
    object: {
        string: 'string',
        array: ['This', 'Is', 'An', 'Array'],
        object: {
            string: 'string',
            array: ['This', 'Is', 'An', 'Array'],
            objectInArray: [
                {
                    string: 'string',
                    array: ['This', 'Is', 'An', 'Array'],
                },
                {
                    string: 'string',
                    array: ['This', 'Is', 'An', 'Array'],
                },
            ],
        },
    },
}
