package com.sos.smartopenspace.services

import com.sos.smartopenspace.domain.UpdatableItemCollection
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UpdatableItemCollectionService {
  fun <T : UpdatableItemCollection> getNewItems(items: Set<T>): Set<T> {
    return items.filter { it.id.toInt() == 0 }.toSet()
  }

  fun <T : UpdatableItemCollection> getDeletedItems(
    items: Set<T>,
    currentItems: MutableSet<T>
  ): Set<T> {
    val remainingItemIds = items.map { it.id }
    return currentItems.filterNot { remainingItemIds.contains(it.id) }.toSet()
  }

}
