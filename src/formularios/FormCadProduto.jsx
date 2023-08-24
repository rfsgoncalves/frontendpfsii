import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {Label, Row, Col, Form, Button } from 'react-bootstrap';
import CaixaSelecao from '../meusComponentes/busca/CaixaSelecao';
import { useState } from 'react';
export default function FormCadProduto(props) {
    const [categoriaSelecionada, setCategoriaSelecionada] = useState({});
    const [produto, setProduto] = useState({
        codigo: 0,
        descricao: "",
        precoCusto: 0,
        precoVenda: 0,
        qtdEstoque: 0,
        categoria: {}
    })

    function manipularMudanca(e) {
        const alvo = e.target.name;
        if (e.target.type === "checkbox") {
            //spread operator = operador de espalhamento
            setProduto({ ...produto, [alvo]: e.target.checked });
        }
        else {
            //spread operator = operador de espalhamento
            setProduto({ ...produto, [alvo]: e.target.value });
        }
    }

    function gravarProduto(e){
        /*fetch('http://129.146.32.171:4000/produtos', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "codigo": produto.codigo,
                "descricao": produto.descricao,
                "precoCusto": produto.precoCusto,
                "precoVenda": produto.precoVenda,
                "qtdEstoque": produto.qtdEstoque,
                "categoria": categoriaSelecionada
            })
        })*/
        console.log(categoriaSelecionada);
        e.stopPropagation();
        e.preventDefault();
    }
    return (
        <>
            <Form onSubmit={gravarProduto}>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Descrição do Produto"
                            className="mb-3"

                        >

                            <Form.Control type="text"
                                placeholder="Informe a descrição do produto"
                                id='descricao'
                                name='descricao'
                                value={produto.descricao}
                                onChange={manipularMudanca}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Preço de Custo:"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Informe a descrição do produto"
                                id='precoCusto'
                                name='precoCusto'
                                value={produto.precoCusto}
                                onChange={manipularMudanca} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label 
                            className="mb-3"

                        >
                            Categoria do Produto:
                        </Label>
                        <CaixaSelecao enderecoFonteDados={"https://129.146.68.51/aluno0-pfsii/categorias"}
                            campoChave={"codigo"}
                            campoExibicao={"nome"}
                            funcaoSelecao={setCategoriaSelecionada} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button type="submit">Cadastrar</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}