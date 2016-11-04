<#include "../template/header.ftl">
Report: ${id} - ${createdAt}<br>

<p>${reportText}<p>
<p><b>Next Steps: </b>${nextSteps}</p>


<#if context.currentUser.id == author.id>
	<#if state == "DRAFT" >
		<button class="reportSubmitBtn" data-id="${id}" >Submit this report.</button> 
	<#else>
		<#if state == "PENDING_APPROVAL">
			Your report is in for review and here is the progress:
	    <#else>
			Your report has been released, here is the approval steps: 
		</#if>
		<table>
			<tr><td>stage</td><td>Status</td><td>Approvers</td></tr>
			<#list approvalStatus as action>
				<tr>
					<td>${action?index}</td>
					<td>
						<#if action.type??>
							${action.type} by ${action.person} on ${action.createdAt}
	      				</#if>
	      			</td>
	      			<td><a href="/groups/${action.step.approverGroup.id}">${action.step.approverGroup.name}</a></td>
	      		</tr>
	      	</#list>
	      </table>
	</#if>	
<#elseif state == "PENDING_APPROVAL" >
	<#--  check if this user can approve this TODO: make this suck less.  -->
	<#list approvalStep.approverGroup.members as m>
		<#if m.id == context.currentUser.id>
			You can approve this report! 
	      	<button data-id="${id}" class="reportApproveBtn" >Approve</button> - 
	      	<button data-id="${id}" class="reportRejectBtn" >Reject</button>
	      </#if>
	</#list> 
</#if>
<#include "../template/footer.ftl">


<script type="text/javascript">
$(document).ready(function() { 
	$(".reportSubmitBtn").on("click", function(event) {
		var id = $(event.currentTarget).attr("data-id"); 
		$.ajax({
			url: "/reports/" + id + "/submit",
			method: "GET"
		}).done(function(response) { 
			location.reload();
		});
	});
	
	$(".reportApproveBtn").on("click", function(event) { 
		var id = $(event.currentTarget).attr("data-id"); 
		$.ajax({
			url: "/reports/" + id + "/approve",
			method: "GET"
		}).done(function(response) { 
			location.reload();
		});
	});
	$(".reportRejectBtn").on("click", function(event) { 
		var id = $(event.currentTarget).attr("data-id"); 
		$.ajax({
			url: "/reports/" + id + "/reject",
			method: "GET"
		}).done(function(response) { 
			location.reload();
		});
	});

});
</script>