# [ADR 001] ID de nuevas entidades de dominio

En el contexto de la creación de una nueva entidad de dominio que expone su ID a través de una API, elegimos utilizar UUID en lugar de un ID numérico autoincremental (por ejemplo, Long). 

Esta decisión mejora la seguridad, ya que evita que un atacante pueda inferir o predecir otros IDs a partir de entidades previamente obtenidas.

Aceptamos el impacto negativo en el rendimiento de búsqueda por ID en bases de datos relacionales, priorizando la seguridad sobre la eficiencia en este caso.


