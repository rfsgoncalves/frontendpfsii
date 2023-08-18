import { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import BarraBusca from "../meusComponentes/busca/BarraBusca";
import CaixaSelecao from "../meusComponentes/busca/CaixaSelecao";
import TabelaItensVenda from "../tabelas/TabelaItensVenda";

export default function FormCadVenda(props) {
    const [validado, setValidado] = useState(false);
    const [listaClientes, setListaClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState({});
    const [produtoSelecionado, setProdutoSelecionado] = useState({});
    const [qtdItem, setQtdItem] = useState(0);
    const [subTotalCalculado, setSubTotalCalculado] = useState(0.00);

    
    //O estado venda possui correlação com a venda gerenciada no backend
    const [venda, setVenda] = useState({
        id: 0,
        dataVenda: "",
        desconto: 0,
        valorTotalTributos: 0,
        cliente: {
            cpf: clienteSelecionado.cpf
        },
        listaProdutos: []
    });

    useEffect(() => {
        fetch('http://129.146.32.171:4000/clientes', { method: "GET" })
            .then((resposta) => {
                return resposta.json();
            })
            .then((listaClientes) => {
                setListaClientes(listaClientes);
            })
            .catch((erro) => {
                //Informar o erro em um componente do tipo Mensagem
                alert("Não foi possível recuperar os clientes do backend.");
            });
    }, []); //willMount

    function manipularMudanca(e) {
        const alvo = e.target.name;
        if (e.target.type === "checkbox") {
            //spread operator = operador de espalhamento
            setVenda({ ...venda, [alvo]: e.target.checked });
        }
        else {
            //spread operator = operador de espalhamento
            setVenda({ ...venda, [alvo]: e.target.value });
        }
    }

    function gravarVenda() {
        fetch('http://129.146.32.171:4000/vendas', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "dataVenda": venda.dataVenda,
                "desconto": venda.desconto,
                "valorTotalTributos": venda.valorTotalTributos,
                "cliente": {
                    "cpf": clienteSelecionado.cpf
                },
                "produtos": venda.listaProdutos
            })
        })
            .then((resposta) => {
                return resposta.json();
            })
            .then((dados) => {
                if (dados.status) {
                    setVenda({ ...venda, id: dados.id });
                }
                alert(dados.mensagem);
            })
            .catch((erro) => {
                alert("Não foi possível registrar a venda: " + erro.message);
            })
    }

    const manipulaSubmissao = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity()) {
            setValidado(false);
            gravarVenda();
        }
        else {
            setValidado(true);
        }
        event.preventDefault();
        event.stopPropagation();


    };

    return (
        <Form noValidate validated={validado} onSubmit={manipulaSubmissao}>
            <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="idVenda">
                    <Form.Label>Nota Fiscal nº</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="0"
                        defaultValue="0"
                        disabled
                        name="id"
                        value={venda.id}
                        onChange={manipularMudanca}
                    />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="dataVenda">
                    <Form.Label>Data da Venda</Form.Label>
                    <Form.Control
                        type="date"
                        required
                        name="dataVenda"
                        value={venda.dataVenda}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor informe a data da venda.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="desconto">
                    <Form.Label>Desconto da Venda</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="0,00"
                        value={venda.desconto}
                        name="desconto"
                        onChange={manipularMudanca}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Por favor, informe um valor para o desconto
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="valorTotalTributos">
                    <Form.Label>Tributos:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="0,00"
                        value={venda.valorTotalTributos}
                        name="valorTotalTributos"
                        onChange={manipularMudanca}
                        required
                        disabled />
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} md="12" controlId="valorTotalTributos">
                    <Form.Label>Cliente:</Form.Label>
                    <BarraBusca campoBusca={"nome"}
                        campoChave={"cpf"}
                        dados={listaClientes}
                        funcaoSelecao={setClienteSelecionado}
                        placeHolder={"Selecione um cliente"}
                        valor={""} />
                </Form.Group>
            </Row>
            <Row>
                {
                    //Seção resposável por permitir que produtos sejam selecionados para a venda
                    //Demonstração de relacionamento muitos para muitos
                }
                <Container className="m-3 border">
                    <Row className="m-3">
                        <Col md={2}>
                            <Form.Label>Selecione um produto</Form.Label>
                        </Col>
                        <Col>
                            <CaixaSelecao enderecoFonteDados={"https://fakestoreapi.com/products"}
                                campoChave={"id"}
                                campoExibicao={"title"}
                                funcaoSelecao={setProdutoSelecionado} />
                        </Col>
                    </Row>
                    <Row>
                        {
                            //Seção ficará responsável por detalhar o produto selecionado
                        }
                        <Col md={10}>
                            <Row>
                                <Col md={1}>
                                    <Form.Group>
                                        <Form.Label>ID:</Form.Label>
                                        <Form.Control type="text" value={produtoSelecionado?.id} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Descrição do Produto:</Form.Label>
                                        <Form.Control type="text" value={produtoSelecionado?.title} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Preço R$:</Form.Label>
                                        <Form.Control type="text" value={produtoSelecionado?.price} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Qtd</Form.Label>
                                        <Form.Control type="number" 
                                            min={1} 
                                            value={qtdItem} 
                                            onChange={(e)=>{
                                                const qtd = parseInt(e.currentTarget.value);
                                                if (qtd > 0){
                                                    setQtdItem(qtd);
                                                    //current referencia o elemento html 
                                                    setSubTotalCalculado(qtd * parseFloat(produtoSelecionado.price));
                                                }
                                            }}
                                            />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>SubTotal</Form.Label>
                                        <Form.Control type="text" value={subTotalCalculado}   disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={1} className="middle">
                                    <Form.Group>
                                        <Form.Label>Adicionar</Form.Label>
                                        <Button onClick={()=>{
                                            let listaItensVendidos = venda.listaProdutos;
                                            listaItensVendidos.push({
                                                codigo:produtoSelecionado.id,
                                                descricao:produtoSelecionado.title,
                                                preco:produtoSelecionado.price,
                                                qtd: qtdItem,
                                                subTotal: subTotalCalculado
                                            });
                                            setVenda({...venda,listaProdutos:listaItensVendidos});
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-bag-plus-fill"
                                                viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z" />
                                            </svg>
                                        </Button>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <p><strong>Lista de produtos selecionados</strong></p>
                        <TabelaItensVenda 
                            listaItens={venda.listaProdutos}
                            setVenda={setVenda}
                            dadosVenda={venda}/>
                    </Row>
                </Container>
            </Row>
            <Button type="submit">Confirmar a Venda</Button>
        </Form>
    );
}