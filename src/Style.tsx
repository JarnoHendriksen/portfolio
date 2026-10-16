import styled from "@emotion/styled";

export const AppBody = styled.div({
    backgroundColor: "var(--color-bg-primary)",
});

export const PrimaryText = styled.p({
    color: 'var(--color-primary)',
    whiteSpace: "pre-wrap",
});

export const Link = styled.a({
    color: "var(--color-secondary)",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
    "&::after": {
        backgroundColor: "var(--color-secondary)",
    },
});

export const CroppedPhoto = styled.div( props => ({
    ":before, :after":{
        backgroundColor: props.className?.includes("narrow-screen") ? "var(--color-bg-primary)" : "var(--color-bg-header)",
        borderColor: "var(--color-primary)",
    },
}));

export const Header = styled.div(props => ({
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-bg-header)',
    '&:after': {
        borderBottom: '2px solid var(--color-primary)',
        backgroundColor: props.className?.includes("narrow-screen") ? "var(--color-bg-header)" : "transparent",
    }
}));

export const H1 = styled.div({
    fontSize: 'calc(12px + 3vmin)',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-bg-header)',
});

export const ThemeBtn = styled.button(props => ({
    background: "transparent",
    border: "none",
    fontSize: "1.5em",
    color: "var(--color-primary)",
    cursor: "pointer",
    transform: props.name === "light" ? "rotate(0deg)" : "rotate(180deg)",
    zIndex: 3,
}));

export const MenuBtn = styled.button(props => ({
    background: "transparent",
    border: "none",
    fontSize: "1.5em",
    color: "var(--color-primary)",
    cursor: "pointer",
    zIndex: 3,
}));

export const Image = styled.img({
    objectFit: "cover",
    border: "2px solid var(--color-primary)",
});

export function Padding({amount}: {amount: string}) {
    return (
        <div style={{width: amount}}></div>
    )
}

export function FormatDate(date: Date) {
    let dateStr: string[] = date.toDateString().split(' ');

    return dateStr[1] + " " + dateStr[3];
}