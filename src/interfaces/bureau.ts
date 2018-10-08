export interface ICreateBureauRequest {
    name: string;
    chineseName: string;
    content: string;
    endTime: string;
    option1?: string;
    option2?: string;
    option3?: string;
    option4?: string;
    option5?: string;
    judgePerson: string;
}

export interface IQueryBureauRequest {
    futureBureauName: string;
}

export interface IBetBureauRequest {
    futureBureauName: string;
    chooseOption: string;
    amount: number;
    password: string;
}

export interface IJudgeBureauRequest {
    futureBureauName: string;
    result: string;
}

export interface IQueryOptionRequest {
    username: string;
    futureBureauName: string;
}

export interface IQueryParticipate {
    username: string;
}
