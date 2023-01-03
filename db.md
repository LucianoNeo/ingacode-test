Utilizando prisma, crie um schema para que seja criado 
a tabela Users
com os campos:
Id: UUID
UserName: varchar(250)
Password: varchar (512)
CreatedAt: DateTimeUTC
UpdatedAt: DateTimeUTC
DeletedAt: DateTimeUTC

crie a tabela Collaborators
com os campos:
Id: UUID
Name: varchar(250)
CreatedAt: DateTimeUTC
UpdatedAt: DateTimeUTC
DeletedAt: DateTimeUTC

crie a tabela TimeTrackers
com os campos:
Id: UUID
StartDate: DateTimeUTC
EndDate: DateTimeUTC
TimeZoneId: varchar(200)
TaskId: UUID
CollaboratorId: UUID
CreatedAt: DateTimeUTC
UpdatedAt: DateTimeUTC
DeletedAt: DateTimeUTC

crie a tabela Tasks
com os campos:
Id: UUID
Name: varchar(250)
Description: varchar(MAX)
ProjectId: UUID
CreatedAt: DateTimeUTC
UpdatedAt: DateTimeUTC
DeletedAt: DateTimeUTC

crie a tabela Projects
com os campos:
Id: UUID
Name: varchar(250)
CreatedAt: DateTimeUTC
UpdatedAt: DateTimeUTC
DeletedAt: DateTimeUTC

com a seguinte regra de negocio:

- Username dever ser único;
- Password deve ser criptografado;
- A tabela de “Collaborators” deve ter um vinculo forte com username;
- Não é possível incluir um timetracker que colida o intervalo de tempo;
- Não é obrigatório um collaborator para uma task;
- É obrigatório que uma task tenha associação a um projeto;
- Uma task pode ter vários timestrackers
- O tempo de início deve ser menor ou igual ao término;
- O time zone local sempre deve ser enviado na requisição de inclusão do tempo;
- O total de horas em tasks dentro de um dia não deve ultrapassar 24hrs