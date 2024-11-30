export const filtrarCartoesAVencer = (cartoes) => {
    const hoje = new Date();
    return cartoes.filter(cartao => {
        const dataTermino = new Date(cartao.dataTermino);
        const diferencaDias = (dataTermino - hoje) / (1000 * 60 * 60 * 24);
        return (
            diferencaDias >= 0 &&
            diferencaDias <= 15 &&
            (cartao.status === 'backlog' || cartao.status === 'in_progress')
        );
    });
};
