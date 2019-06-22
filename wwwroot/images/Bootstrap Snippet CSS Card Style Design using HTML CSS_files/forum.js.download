$( document ).ready(function() {

	$('[data-toggle="popover"]').popover({
		container: 'body'
	});
	$(document).on('click','[data-toggle="popover"], .forumReply', function(e) { e.preventDefault(); return true; });

	$(document).on('click','#newPostButton',function() {
		$('.forumDivOuter').show();
		$('#newPostContainer').hide();
	});

	$(document).on('click','#moreButton',function() {
		forumPage++;
		$.get('', {page: forumPage})
		.done(function(d) {
			if (d != '') {
				$("#moreButton").before(d);
			} else {
				$("#moreButton").html('You have reached the end').attr('disabled','disabled');
			}
		});
	});
	$(document).on('click','.forumvote',function() {
		var t = $(this);
		postid = t.parent().parent().parent().data('postid');
		$.post('/api/forumVote', { postid: postid, vote: t.data('vote') })
		.done(function(data) {
			if (data.status == 'OK') {
				var total = parseInt(t.siblings('.forumVoteTotal').html());
				t.siblings('.forumVoteTotal').html(total+t.data('vote'));
			} else if (data.status == 'login') {
				alert('Please login before posting a comment');
			} else {
				alert('There was an error posting your comment.');
			}
		})
		
	});

	$(document).on('click','.forumReply',function() {
		$('#forumDiv > .forumPost').attr('rows','4');
		$(this).parent().append('<blockquote>'+$('#forumDiv').html()+'</blockquote>');
		$(this).remove();	
	});

	$(document).on('click','.forumPostButton',function() {
		var t = $(this);
		msg = t.siblings('.forumPost').val();
		postid = typeof t.parent().parent().parent().data('postid') !== 'undefined' ? t.parent().parent().parent().data('postid') : 0;
		if (typeof $('#forumPostId').data('postid') !== 'undefined' && postid == 0) {
			postid = $('#forumPostId').data('postid');
		}
		url = window.location.hostname+window.location.pathname;
		$.post('/api/forumPost', { title: $('#forumPostTitle').val(),catid:$('#forumTopicId').data('topicid'),msg: msg, postid: postid, url: url,title: document.title,forumIdHash: $('#forumIdHash').val() })
		.done(function(data) {
			if (data.status == 'OK') {
				t.parent().parent().addClass('hidden');
				$('.reply.'+postid+'.name').html('You');
				$('.reply.'+postid+'.name').parent().parent().prepend(data.msg);
				$('.reply.'+postid+'.name').parent().parent().removeClass('hidden');
			} else if (data.status == 'login') {
				alert('Please login before posting a comment');
			} else {
				alert('There was an error posting your comment.');
			}
		})
		.fail(function() {
			alert('There was an error posting your comment.');
		})
		;
	});

	$(document).one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });
});



