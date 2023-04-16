import React from 'react';
import { Formik, Field, FieldArray } from 'formik';
import { Row, Col } from 'react-bootstrap';

// eslint-disable-next-line react/no-unstable-nested-components
function Recursive({
  values,
  setFieldValue,
  nameArray = 'friends',
  level = 0,
}) {
  return (
    <FieldArray name={nameArray}>
      {({ push, remove, swap }) => {
        const addChild = (friend, index) => {
          friend.friends.push({ name: '', email: '', friends: [] });
          // o método swap é só pra atualizar o estado pq nao utilizei funcao nativa do formik para adicionar o form filho
          swap(index, index);
        };
        return (
          <div
            className="border"
            style={{ background: 'rgba(69, 98, 150, 0.25)' }}
          >
            {level === 0 ? (
              <button
                type="button"
                onClick={() => push({ name: '', email: '', friends: [] })}
                style={{ marginLeft: `${level * 20}px` }}
              >
                Add Friend
              </button>
            ) : null}

            {values.friends.map((friend, index) => (
              <div>
                <div key={index}>
                  <label
                    htmlFor={`${nameArray}.${index}.name`}
                    style={{ marginLeft: `${level * 20}px` }}
                  >
                    Name
                  </label>
                  <Field
                    id={`${nameArray}.${index}.name`}
                    name={`${nameArray}.${index}.name`}
                    type="text"
                  />
                  <label htmlFor={`${nameArray}.${index}.email`}>Email</label>
                  <Field
                    id={`${nameArray}.${index}.email`}
                    name={`${nameArray}.${index}.email`}
                    type="email"
                  />
                  <button type="button" onClick={() => remove(index)}>
                    Remove Friend
                  </button>
                  <button type="button" onClick={() => addChild(friend, index)}>
                    Add Child
                  </button>
                  {friend.friends.length > 0 ? (
                    <>
                      {/* <h4 style={{ marginLeft: `${level * 20}px` }}>Filhos</h4> */}
                      <div>
                        <Recursive
                          values={friend}
                          setFieldValue={setFieldValue}
                          level={level + 1}
                          nameArray={`${nameArray}.${index}.friends`}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </FieldArray>
  );
}

function MyForm() {
  const initialValues = {
    friends: [],
  };

  return (
    <Formik initialValues={initialValues}>
      {({ values, setFieldValue }) => (
        <form>
          <h3>Friends</h3>
          <Recursive values={values} setFieldValue={setFieldValue} />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
}

export default MyForm;
