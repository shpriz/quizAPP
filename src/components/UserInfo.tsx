import { Container, Card, Form, Button } from 'react-bootstrap'

interface UserInfoProps {
  onSubmit: (userData: { firstName: string; lastName: string }) => void
}

const UserInfo: React.FC<UserInfoProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    onSubmit({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string
    })
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <h3 className="text-center mb-4">Информация о пользователе</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                required
                placeholder="Введите ваше имя"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Фамилия</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                required
                placeholder="Введите вашу фамилию"
              />
            </Form.Group>
            <div className="text-center">
              <Button type="submit" variant="primary" size="lg">
                Начать тест
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default UserInfo
