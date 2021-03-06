const querystring = require('querystring')

const { BRAND_TYPE } = require('../../types')
const { Scheduler } = require('../../scheduler')
const { Transform } = require('../../transform')

const BITBUCKET_REPO_TYPE = 'bitbucket:repo'
const BITBUCKET_SNIPPET_TYPE = 'bitbucket:snippet'
const BITBUCKET_MEMBER_TYPE = 'bitbucket:member'

const bitbucketApiScheduler = new Scheduler({
    maxConcurrent: 1
})

const bitbucketListRepos = class extends Transform {
    static get alias() {
        return ['bitbucket_list_repos', 'bblr']
    }

    static get title() {
        return 'List Bitbucket Repos'
    }

    static get description() {
        return 'List Bitbucket repositories.'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return [BRAND_TYPE, BITBUCKET_MEMBER_TYPE]
    }

    static get priority() {
        return 1
    }

    static get noise() {
        return 1
    }

    static get options() {
        return {}
    }

    constructor() {
        super()

        this.headers = {
            'user-agent': 'Pown'
        }
    }

    async handle({ id: source = '', label = '' }) {
        const results = []

        const search = querystring.escape(label)

        const { responseBody } = await bitbucketApiScheduler.tryRequest({ uri: `https://api.bitbucket.org/2.0/repositories/${search}`, headers: this.headers })

        const json = JSON.parse(responseBody.toString() || '{}') || {}

        const { error, values = [] } = json

        if (error) {
            this.error(error.message)

            return results
        }

        values.forEach(({ full_name: fullName = '', owner = {} }) => {
            const repoId = this.makeId(BITBUCKET_REPO_TYPE, `${label}`)

            const uri = `https://bitbucket.com/${fullName}`

            results.push({ id: repoId, type: BITBUCKET_REPO_TYPE, label: fullName, props: { uri, fullName }, edges: [source] })

            const { username: ownerUsername = '', displayName: ownerDisplayName = '', links: ownerLinks = {} } = owner

            const { html: ownerUri = {}, avatar: ownerAvatar = {} } = ownerLinks

            const ownerId = this.makeId(BITBUCKET_MEMBER_TYPE, ownerUsername)
            const ownerLabel = ownerDisplayName || ownerUsername

            results.push({ id: ownerId, type: BITBUCKET_MEMBER_TYPE, label: ownerLabel, image: ownerAvatar.href, props: { username: ownerUsername, uri: ownerUri.href }, edges: [repoId] })
        })

        return results
    }
}

const bitbucketListSnippets = class extends Transform {
    static get alias() {
        return ['bitbucket_list_snippets', 'bbls']
    }

    static get title() {
        return 'List Bitbucket Snippets'
    }

    static get description() {
        return 'List Bitbucket snippets.'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return [BRAND_TYPE, BITBUCKET_MEMBER_TYPE]
    }

    static get priority() {
        return 1
    }

    static get noise() {
        return 1
    }

    static get options() {
        return {}
    }

    constructor() {
        super()

        this.headers = {
            'user-agent': 'Pown'
        }
    }

    async handle({ id: source = '', label = '' }) {
        const results = []

        const search = querystring.escape(label)

        const { responseBody } = await bitbucketApiScheduler.tryRequest({ uri: `https://api.bitbucket.org/2.0/snippets/${search}`, headers: this.headers })

        const json = JSON.parse(responseBody.toString() || '{}') || {}

        const { error, values = [] } = json

        if (error) {
            this.error(error.message)

            return results
        }

        values.forEach(({ id = '', links = {}, title = '', owner = {} }) => {
            const { html: htmlLinks = {} } = links

            const { href: uri = '' } = htmlLinks

            const snippetId = this.makeId(BITBUCKET_SNIPPET_TYPE, `${label}:${id}`)

            results.push({ id: snippetId, type: BITBUCKET_SNIPPET_TYPE, label: title, props: { title, uri }, edges: [source] })

            const { username: ownerUsername = '', displayName: ownerDisplayName = '', links: ownerLinks = {} } = owner

            const { html: ownerUri = {}, avatar: ownerAvatar = {} } = ownerLinks

            const ownerId = this.makeId(BITBUCKET_MEMBER_TYPE, ownerUsername)
            const ownerLabel = ownerDisplayName || ownerUsername

            results.push({ id: ownerId, type: BITBUCKET_MEMBER_TYPE, label: ownerLabel, image: ownerAvatar.href, props: { username: ownerUsername, uri: ownerUri.href }, edges: [snippetId] })
        })

        return results
    }
}

const bitbucketListTeamRepos = class extends Transform {
    static get alias() {
        return ['bitbucket_list_team_repos', 'bbltr']
    }

    static get title() {
        return 'List Bitbucket Team Repos'
    }

    static get description() {
        return 'List Bitbucket team repos.'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return [BRAND_TYPE, BITBUCKET_MEMBER_TYPE]
    }

    static get options() {
        return {}
    }

    static get priority() {
        return 1
    }

    static get noise() {
        return 1
    }

    constructor() {
        super()

        this.headers = {
            'user-agent': 'Pown'
        }
    }

    async handle({ id: source = '', label = '' }, options) {
        const results = []

        const search = querystring.escape(label)

        const { responseBody } = await bitbucketApiScheduler.tryRequest({ uri: `https://api.bitbucket.org/2.0/teams/${search}/repositories`, headers: this.headers })

        const json = JSON.parse(responseBody.toString() || '{}') || {}

        const { error, values = [] } = json

        if (error) {
            this.error(error.message)

            return results
        }

        // TODO: add code here

        return results
    }
}

const bitbucketListTeamMembers = class extends Transform {
    static get alias() {
        return ['bitbucket_list_team_members', 'bbltm']
    }

    static get title() {
        return 'List Bitbucket Team Members'
    }

    static get description() {
        return 'List Bitbucket team members.'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return [BRAND_TYPE, BITBUCKET_MEMBER_TYPE]
    }

    static get options() {
        return {}
    }

    static get priority() {
        return 1
    }

    static get noise() {
        return 1
    }

    constructor() {
        super()

        this.headers = {
            'user-agent': 'Pown'
        }
    }

    async handle({ id: source = '', label = '' }, options) {
        const results = []

        const search = querystring.escape(label)

        const { responseBody } = await bitbucketApiScheduler.tryRequest({ uri: `https://api.bitbucket.org/2.0/teams/${search}/members`, headers: this.headers })

        const json = JSON.parse(responseBody.toString() || '{}') || {}

        const { error, values = [] } = json

        if (error) {
            this.error(error.message)

            return results
        }

        // TODO: add code here

        return results
    }
}

module.exports = { bitbucketListRepos, bitbucketListSnippets, bitbucketListTeamRepos, bitbucketListTeamMembers }
