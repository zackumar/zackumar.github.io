const mail = 'moc.liamg/2ramukcaz'.split('').reverse().join('').replace('/', '@')

let whoami = {
    name: 'Zack Umar',
    description: "Student working towards a Bachelor\\'s degree in CS",
    eductation: [
        {
            school: 'University of Texas at San Antonio',
            major: 'Computer Science',
            expected_graduation: 'May 2024',
            current_gpa: '4.0',
        },
    ],
    projects: ['<a class="item" href="https://github.com/zackumar/Belnades">belnades</a>', '<a href="https://github.com/zackumar">more on github...</a>'],
    contact: [`<a class="item" href="${mail}">${mail}</a>`, '<a class="item" href="https://www.linkedin.com/in/zackumar/">linkedin</a>'],
    other_links: ['<a class="item" href="https://github.com/zackumar">github</a>', '<a class="item" href="https://twitter.com/mcgoodmen">twitter</a>'],
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
