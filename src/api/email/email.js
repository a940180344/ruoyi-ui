import request from '@/utils/request'

// 查询email列表
export function listEmail(query) {
  return request({
    url: '/email/email/list',
    method: 'get',
    params: query
  })
}

// 查询email详细
export function getEmail(id) {
  return request({
    url: '/email/email/' + id,
    method: 'get'
  })
}

// 新增email
export function addEmail(data) {
  return request({
    url: '/email/email',
    method: 'post',
    data: data
  })
}

// 修改email
export function updateEmail(data) {
  return request({
    url: '/email/email',
    method: 'put',
    data: data
  })
}

// 删除email
export function delEmail(id) {
  return request({
    url: '/email/email/' + id,
    method: 'delete'
  })
}
