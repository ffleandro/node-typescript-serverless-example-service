export interface Acronym {
    acronym: string
    description: string
}

export interface AcronymList {
    cursor?: string
    acronyms: Acronym[]
}
