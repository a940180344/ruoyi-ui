import request from '@/utils/request'

// 查询发布文章列表
export function listEssay(query) {
  return request({
    url: '/essay/essay/list',
    method: 'get',
    params: query
  })
}

// 查询发布文章详细
export function getEssay(essayId) {
  return request({
    url: '/essay/essay/' + essayId,
    method: 'get'
  })
}

// 新增发布文章
export function addEssay(data) {
  return request({
    url: '/essay/essay',
    method: 'post',
    data: data
  })
}

// 修改发布文章
export function updateEssay(data) {
  return request({
    url: '/essay/essay',
    method: 'put',
    data: data
  })
}

// 删除发布文章
export function delEssay(essayId) {
  return request({
    url: '/essay/essay/' + essayId,
    method: 'delete'
  })
}
