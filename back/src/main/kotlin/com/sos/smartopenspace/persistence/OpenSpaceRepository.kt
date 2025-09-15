package com.sos.smartopenspace.persistence

import com.sos.smartopenspace.domain.OpenSpace
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.util.Optional

interface OpenSpaceRepository : CrudRepository<OpenSpace, Long> {

  @Query("SELECT os FROM OpenSpace os join os.talks tk WHERE tk.id = :talkId")
  fun findFirstOpenSpaceByTalkId(@Param("talkId") talkId: Long): OpenSpace

  fun findAllByOrganizerId(userId: Long): List<OpenSpace>

  @EntityGraph(attributePaths = ["assignedSlots.talk.reviews", "assignedSlots.talk.documents"])
  override fun findById(id: Long): Optional<OpenSpace>
}
