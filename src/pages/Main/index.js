import React, { useState, useCallback, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { FaTrash, FaGithub, FaPlus, FaSpinner, FaBars } from "react-icons/fa";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlerta] = useState(null);

  // Buscar
  useEffect(() => {
    const repoStorage = localStorage.getItem("repos");
    if (repoStorage) {
      setRepositorios(JSON.parse(repoStorage));
    }
  }, []);

  // Salvar
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repositorios));
  }, [repositorios]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        setAlerta(null);
        try {
          if (newRepo === "") {
            throw new Error("Você precisa indicar um repositorio!");
          }

          const res = await api.get(`repos/${newRepo}`);

          const hasRepo = repositorios.find((repo) => repo.name === newRepo);

          if (hasRepo) {
            throw new Error("Repositorio duplicado!");
          }

          const data = {
            name: res.data.full_name,
          };
          console.log(data);
          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (err) {
          setAlerta(true);
          console.log(err);
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, repositorios]
  );

  function handleinputChange(e) {
    setNewRepo(e.target.value);
    setAlerta(null);
  }

  const handleDelete = useCallback(
    (repo) => {
      const find = repositorios.filter((r) => r.name !== repo);
      setRepositorios(find);
    },
    [repositorios]
  );

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus Repositórios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={handleinputChange}
        />
        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositorios.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
