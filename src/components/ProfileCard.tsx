import { Card } from "react-bootstrap"

export type Profile = {
    username : string,
    email : string
}

export type ProfileCardProp = {
    profile : Profile | null
}

export function ProfileCard({profile} : ProfileCardProp){
    return(
        <Card>
            <Card.Header>Profile</Card.Header>
            <Card.Body>
                <Card.Text>
                    Username: {profile ? profile.username : ""}
                </Card.Text>
                <Card.Text>
                    Email: {profile ? profile.email : ""}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}