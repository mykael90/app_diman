<Row className="my-4">
{Object.entries(sipac.dadosJSON).map(([key, value]) => (
  <p>
    {key}: {value}
  </p>
))}
</Row>





<Row className="my-4">
{sipac.itensJSON.map((item, index) => (
  <div>
    {Object.entries(item).map(([key, value]) => (
      <p>
        {key}: {value}
      </p>
    ))}
  </div>
))}
</Row>



<Row className="my-4">{JSON.stringify(sipac.itensJSON)}</Row>

<Row className="my-4">{JSON.stringify(sipac.itensJSON[0].Nr)}</Row>
<Row className="my-4">{JSON.stringify(sipac.itensJSON[0]['Código'])}</Row>
<Row className="my-4">
  {JSON.stringify(sipac.itensJSON[0]['Denominação'])}
</Row>



    <Row className="my-4">
  {sipac.itensJSON.map((item) => (
    <p key={item.Nr}>{item.Nr}</p>
  ))}
</Row>

<Row>{array1.length}</Row>
<Row className="my-4">
  {JSON.stringify(sipac.itensJSON[0]['Denominação'])}
</Row>
<Row className="my-4">{sipac.itensJSON.length}</Row>
<Row className="my-4">{typeof sipac.itensJSON}</Row>
<Row className="my-4">
  {sipac.itensJSON.map((item) => (
    <p>{item}</p>
  ))}
</Row>


<Row>{array1.length}</Row>
<Row className="my-4">
  {JSON.stringify(sipac.itensJSON[0]['Denominação'])}
</Row>
<Row className="my-4">{sipac.itensJSON.length}</Row>
<Row className="my-4">{typeof sipac.itensJSON}</Row>
<Row className="my-4">
  {sipac.itensJSON.map(item => (
    <p key={item.Nr}>{item.Nr}</p>
  ))}
</Row>

<Row className="my-4">
{Object.entries(sipac.dadosJSON).map(([key, value]) => (
  <p>
    {key}: {value}
  </p>
))}
</Row>

<Row className="my-4">{JSON.stringify(sipac.itensJSON)}</Row>

<Row className="my-4">
{Array.from(sipac.itensJSON).forEach((item, index) => (
  <div>
    {Object.entries(item).map(([key, value]) => (
      <p key={index}>
        {key}: {value}
      </p>
    ))}
  </div>
))}
</Row>

<Row className="my-4">
{sipac.itensJSON.map((item, index) => (
  <div>
    {item}
  </div>
))}
</Row>

<Row className="my-4">
{sipac.itensJSON.map((item, index) => (
  <p>{JSON.stringify(item)}</p>
))}
</Row>
