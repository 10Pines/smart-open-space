package com.sos.smartopenspace.domain

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.persistence.*
import java.net.URL
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

@Entity
class Talk(
  @field:NotEmpty(message = "Ingrese un nombre")
  @field:NotBlank(message = "Nombre no puede ser vacío")
  var name: String,

  @Column(columnDefinition = "VarChar")
  var description: String = "",

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Long = 0,

  var meetingLink: URL? = null,

  @field:Valid
  @ManyToOne
  var track: Track? = null,

  @field:Valid
  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinColumn(name = "talk_id")
  val documents: MutableSet<Document> = mutableSetOf(),

  @field:Valid
  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinColumn(name = "talk_id")
  val reviews: MutableSet<Review> = mutableSetOf(),

  @ManyToOne
  val speaker: User,

  var isMarketplaceTalk: Boolean = false,
  var speakerName: String? = null
) {

    @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "vote",
          joinColumns = [JoinColumn(name = "talk_id", referencedColumnName = "id")],
          inverseJoinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")])
  var votingUsers: MutableSet<User> = mutableSetOf()

  fun update(openSpace: OpenSpace, name: String, description: String, meetingLink: URL? = null, track: Track? = null) {
    openSpace.checkTrackIsValid(track)
    this.name = name
    this.description = description
    this.meetingLink = meetingLink
    this.track = track
  }

  fun updateDocuments(newDocuments: Set<Document>, deletedDocuments: Set<Document>) {
    this.documents.removeAll(deletedDocuments.toSet())
    this.documents.addAll(newDocuments)
  }
  
  @JsonProperty
  fun votes(): Int {
    return votingUsers.size
  }

  fun addVoteBy(user: User) {
    votingUsers.add(user)
  }

  fun removeVoteBy(user: User) {
    if (!votingUsers.contains(user))
      throw UserDidntVoteThisTalkException()

    votingUsers.remove(user)
  }

  fun addReview(review: Review) = this.reviews.add(review)
}
